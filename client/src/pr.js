import React from 'react'
import glamorous, { Div, Span } from 'glamorous'

import Heading from './heading'
import Spacer from './spacer'

const Link = glamorous.a({
  color: '#2A91CC',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
})
const timeAgo = val => timespan(new Date() - new Date(val))

const Pr = ({ pr }) => {
  const additionalCommenters = pr.commenters.filter(
    c => c !== pr.author && c !== pr.gtgReviewer
  )

  return (
    <Div display="flex" flexDirection="column">
      <Div>
        <Link href={`/pull-requests/${pr.number}`}>{pr.title}</Link>
      </Div>
      <Spacer height="5px" />
      <Div>
        <span>opened {timeAgo(pr.dateCreated)} ago by {pr.author} </span>
        <Additions value={pr.additions} />, <Deletions value={pr.deletions} />
      </Div>
    </Div>
  )
}

const Additions = ({ value }) => <Span color="#00c100">+{value}</Span>
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
