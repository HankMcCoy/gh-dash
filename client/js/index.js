window
  .fetch('/api/pull-requests')
  .then(res => res.json())
  .then(({ pullRequests }) => {
    console.log('prs', pullRequests)
    document.querySelector('main').innerHTML = renderPrs(pullRequests)
  })

function renderPrs(prs) {
  return `
    <h1>Pull Requests</h1>
    ${prs.map(renderPr).join('')}
    <style>
      body {
        font-family: sans-serif;
      }
    </style>
  `
}

function renderPr(pr) {
  const additionalCommenters = pr.commenters.filter(
    c => c !== pr.author && c !== pr.gtgReviewer
  )

  return `
    <div class="pr">
      <h2>${pr.title}</h2>
      <div>
        <span class="additions">+${pr.additions}</span>,
        <span class="deletions">-${pr.deletions}</span>
      </div>
      <div>
        Author: ${pr.author}
      </div>
      ${pr.gtgReviewer ? `
          <div>
            Reviewer: ${pr.gtgReviewer}
          </div>
        ` : ''}
      <div>
        ${additionalCommenters.length ? `Additional commenters: ${additionalCommenters.join(', ')}` : ''}
      </div>
      <div>
        ${pr.times.waitingForReview ? `Waited ${renderTimespan(pr.times.waitingForReview)} for review` : ''}
      </div>
      <div>
        ${pr.times.spentInReview ? `Review took ${renderTimespan(pr.times.spentInReview)}, ` : ''}
        ${pr.numRevisions ? `${pr.numRevisions} revision${pr.numRevisions === 1 ? '' : 's'} requested` : ''}
      </div>
      <div>
        ${pr.times.afterReviewBeforeMerge ? `${renderTimespan(pr.times.afterReviewBeforeMerge)} between GtG and merging` : ''}
      </div>
    </div>
    <style>
      .pr + .pr { margin-top: 20px; }
      .additions { color: #0f0; }
      .deletions { color: #f00; }
    </style>
  `
}

function renderTimespan(timespan) {
  const render = (amt, label) =>
    amt === 1 ? `${amt} ${label.slice(0, -1)}` : `${amt} ${label}`

  const seconds = Math.round(timespan / 1000)
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
