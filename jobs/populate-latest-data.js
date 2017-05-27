#! /usr/bin/env node
'use strict'
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const _ = require('lodash')
const compact = require('lodash/fp/compact')
const flow = require('lodash/fp/flow')
const sortBy = require('lodash/fp/sortBy')
const first = require('lodash/fp/first')
const request = require('superagent-promise')(require('superagent'), Promise)
const querystring = require('querystring')

// Connection URL
const mongoConnectionStr = 'mongodb://localhost:27017/gh-dash'

const org = 'buildingconnected'
const repo = 'client'
const token = process.env.GH_TOKEN
const api = 'https://api.github.com'
const repoUrl = `${api}/repos/${org}/${repo}`
const getJson = url =>
  (console.log(url), request.get(url).end().then(res => res.body))
const getGhJson = ({ path, query }) => {
  let queryStr = querystring.stringify(query)
  queryStr = queryStr
    ? `${queryStr}&access_token=${token}`
    : `access_token=${token}`

  return getJson(`${repoUrl}/${path}?${queryStr}`)
}

function getProcessedPrs() {
  console.log('GETPROCESSED')
  return getPrNumbers().then(getActualPrsWithEvents).then(createFinalPrObjs)
}

function getPrNumbers() {
  console.log('GET NUMS')
  return getGhJson({
    path: 'pulls',
    query: { per_page: '100' },
  }).then(prs => prs.map(pr => pr.number))
}

function getActualPrsWithEvents(prNumbers) {
  console.log('GET ACTUAL')
  return Promise.all(
    prNumbers.map(number =>
      Promise.all([
        getGhJson({
          path: `pulls/${number}`,
        }),
        getGhJson({
          path: `issues/${number}/events`,
          query: { per_page: '100' },
        }),
      ]).then(([pr, events]) => ({ pr, events }))
    )
  )
}

const isGtg = event => _.get(event, 'label.name') === 'good to go'
const getLastGtgEvent = events => _.last(events.filter(isGtg))

function createFinalPrObjs(prsAndEvents) {
  console.log('CREATE FINAL', prsAndEvents.length)
  return prsAndEvents.map(thing => {
    console.log('THING', thing)
    const { pr, events = [] } = thing
    const gtgEvent = getLastGtgEvent(events)
    const commenters = _.uniq(
      events.map(e => _.get(e, 'comment.user.login')).filter(x => x)
    )
    const needsRevisionEvents = events.filter(
      e => _.get(e, 'label.name') === 'needs revision/discussion'
    )
    const firstReviewLabelChangeEvent = flow(
      compact,
      sortBy('created_at'),
      first
    )([gtgEvent].concat(needsRevisionEvents))

    return {
      id: pr.id,
      number: pr.number,
      author: pr.user.login,
      additions: pr.additions,
      deletions: pr.deletions,
      dateCreated: pr.created_at,
      dateClosed: pr.closed_at,
      dateMerged: pr.merged_at,
      gtgReviewer: gtgEvent && gtgEvent.actor.login,
      commenters,
      numRevisions: needsRevisionEvents.length,
      times: {
        waitingForReview: null,
        spentInReview: null,
        afterReviewBeforeMerge: null,
      },
    }
  })
}

// Use connect method to connect to the server
MongoClient.connect(mongoConnectionStr).then(
  db => {
    console.log('Connected successfully to server')

    const getProcessedPrsPromise = getProcessedPrs()
    getProcessedPrsPromise.then(
      finalPrs => {
        console.log(finalPrs)
        db.close()
      },
      err => {
        console.error(err)
        db.close()
      }
    )
  },
  err => {
    assert.equal(null, err)
  }
)
