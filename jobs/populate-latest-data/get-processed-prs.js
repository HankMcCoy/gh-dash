'use strict'

const _ = require('lodash')
const compact = require('lodash/fp/compact')
const flow = require('lodash/fp/flow')
const sortBy = require('lodash/fp/sortBy')
const first = require('lodash/fp/first')
const parseLinkHeader = require('parse-link-header')

let xhr

function getProcessedPrs({ url, org, repo }) {
  xhr = require('./xhr').create({ org, repo })

  let next
  return getPrNumbers({ url })
    .then(({ next: nextArg, numbers }) => {
      next = nextArg
      return getActualPrsWithEvents(numbers)
    })
    .then(prsAndEvents => createFinalPrObjs({
      org,
      prsAndEvents,
      repo,
    }))
    .then(prs => ({ next, prs }))
}

function getPrNumbers({ url }) {
  return xhr.getJson(url).then(({ headers, body: prs }) => {
    const next = parseLinkHeader(headers.link).next
    return {
      next,
      numbers: prs.map(pr => pr.number),
    }
  })
}

function getActualPrsWithEvents(prNumbers) {
  return Promise.all(
    prNumbers.map(number =>
      Promise.all([
        xhr.getGhJson({
          path: `pulls/${number}`,
        }).then(({ body }) => body),
        xhr.getGhJson({
          path: `issues/${number}`,
        }).then(({ body }) => body),
        xhr.getGhJson({
          path: `issues/${number}/timeline`,
          query: { per_page: '100' },
        }).then(({ body }) => body),
      ]).then(([pr, issue, events]) => ({ pr, issue, events }))
    )
  )
}

const filterEventsByLabel = (events, label) =>
  events.filter(e => _.get(e, 'label.name') === label)
const getLastGtgEvent = events =>
  _.last(filterEventsByLabel(events, 'good to go'))

const getDateCreated = event => (event ? new Date(event.created_at) : null)

function createFinalPrObjs({ org, prsAndEvents, repo }) {
  return prsAndEvents.map(thing => {
    const { pr, issue, events = [] } = thing
    const gtgEvent = getLastGtgEvent(events)
    const dateGtG = getDateCreated(gtgEvent)
    const dateMerged = pr.merged_at ? new Date(pr.merged_at) : null
    const dateClosed = pr.closed_at ? new Date(pr.closed_at) : null
    const dateCreated = pr.created_at ? new Date(pr.created_at) : null
    const commentEvents = events.filter(e => e.event === 'commented')
    const commenters = _.uniq(commentEvents.map(e => e.actor.login))
    const needsReviewEvents = filterEventsByLabel(events, 'needs review')
    const needsRevisionEvents = filterEventsByLabel(
      events,
      'needs revision/discussion'
    )
    const firstNeedsReviewEvent = _.first(needsReviewEvents)
    const dateFirstNeedsReview = getDateCreated(firstNeedsReviewEvent)

    const firstReviewLabelChangeEvent = flow(
      compact,
      sortBy('created_at'),
      first
    )([gtgEvent].concat(needsRevisionEvents))
    const dateFirstReviewLabelChanged = getDateCreated(
      firstReviewLabelChangeEvent
    )

    let waitingForReview = null
    let spentInReview = null
    let afterReviewBeforeMerge = null

    if (dateFirstReviewLabelChanged && dateFirstNeedsReview) {
      waitingForReview = dateFirstReviewLabelChanged - dateFirstNeedsReview
    }

    if (dateFirstReviewLabelChanged && dateGtG) {
      spentInReview = dateGtG - dateFirstReviewLabelChanged
    }

    if (dateMerged && dateGtG) {
      afterReviewBeforeMerge = dateMerged - dateGtG
    }

    return {
      id: pr.id,
      org,
      repo,
      number: pr.number,
      title: pr.title,
      body: pr.body,
      author: pr.user.login,
      additions: pr.additions,
      deletions: pr.deletions,
      dateCreated,
      dateClosed,
      dateMerged,
      gtgReviewer: gtgEvent && gtgEvent.actor.login,
      commenters,
      numRevisions: needsRevisionEvents.length,
      labels: issue.labels,
      times: {
        waitingForReview,
        spentInReview,
        afterReviewBeforeMerge,
      },
    }
  })
}

module.exports = getProcessedPrs
