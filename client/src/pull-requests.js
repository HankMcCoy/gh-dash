import React, { Component } from 'react'

import Pr from './pr'
import Spacer from './spacer'
import SectionHeader from './section-header'
import intersperse from './util/intersperse'

const addMargins = intersperse(i => <Spacer height="12px" key={i} />)

const PullRequests = ({ pullRequests }) => (
  <div>
    <SectionHeader>Open pull requests</SectionHeader>
    <Spacer height="10px" />
    {addMargins(pullRequests.map(pr => <Pr pr={pr} key={pr._id} />))}
  </div>
)

class PullRequestsContainer extends Component {
  state = { pullRequests: null }

  render() {
    const { pullRequests } = this.state
    return pullRequests ? <PullRequests pullRequests={pullRequests} /> : null
  }

  componentDidMount() {
    window
      .fetch('/api/pull-requests')
      .then(res => res.json())
      .then(({ pullRequests }) => {
        this.setState({ pullRequests })
      })
  }
}

export default PullRequestsContainer
