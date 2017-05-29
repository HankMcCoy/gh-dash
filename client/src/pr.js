import React from 'react'
import { Span } from 'glamorous'

const Pr = ({ pr }) => {
  const additionalCommenters = pr.commenters.filter(
    c => c !== pr.author && c !== pr.gtgReviewer
  )

  return (
    <div>
      <h2>{pr.title}</h2>
      <div>
        <Additions value={pr.additions} />
        <Deletions value={pr.deletions} />
      </div>
      <div>
        Author: {pr.author}
      </div>
      {pr.gtgReviewer
        ? <div>
            Reviewer: ${pr.gtgReviewer}
          </div>
        : ''}
      <div>
        {additionalCommenters.length
          ? `Additional commenters: ${additionalCommenters.join(', ')}`
          : ''}
      </div>
      <div>
        {pr.times.waitingForReview
          ? `Waited ${timespan(pr.times.waitingForReview)} for review`
          : ''}
      </div>
      <div>
        {pr.times.spentInReview
          ? `Review took ${timespan(pr.times.spentInReview)}, `
          : ''}
        {pr.numRevisions
          ? `${pr.numRevisions} revision${pr.numRevisions === 1 ? '' : 's'} requested`
          : ''}
      </div>
      <div>
        {pr.times.afterReviewBeforeMerge
          ? `${timespan(pr.times.afterReviewBeforeMerge)} between GtG and merging`
          : ''}
      </div>
    </div>
  )
}

const Additions = ({ value }) => <Span color="#0f0">+{value}</Span>
const Deletions = ({ value }) => <Span color="#f00">-{value}</Span>

const timespan = value => {
  const render = (amt, label) =>
    amt === 1 ? `${amt} ${label.slice(0, -1)}` : `${amt} ${label}`

  const seconds = Math.round(value / 1000)
  if (seconds < 90) {
    return render(seconds, 'seconds')
  }

  const minutes = Math.round(seconds / 60)
  if (minutes < 90) {
    return render(minutes, 'minutes')
  }

  const hours = Math.round(minutes / 60)
  if (hours < 36) {
    return render(hours, 'hours')
  }

  const days = Math.round(hours / 24)
  return render(days, 'days')
}

export default Pr
