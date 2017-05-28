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
  return `
    <div class="pr">
      <h2>${pr.title}</h2>
      <div>
        <span class="additions">+${pr.additions}</span>,
        <span class="deletions">-${pr.deletions}</span>
      </div>
    </div>
    <style>
      .pr + .pr { margin-top: 20px; }
      .additions { color: #0f0; }
      .deletions { color: #f00; }
    </style>
  `
}
