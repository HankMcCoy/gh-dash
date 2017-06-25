import React, { Component } from 'react'

import Pr from './pr'
import Spacer from './spacer'
import SectionHeader from './section-header'
import intersperse from './util/intersperse'

const addMargins = intersperse(i => <Spacer height="12px" key={i} />)

class Fetch extends Component {
  state = { responseJson: undefined }

  render() {
    const { children, LoadingComponent } = this.props
    const { responseJson } = this.state

    return responseJson
      ? children(responseJson)
      : LoadingComponent ? <LoadingComponent /> : null
  }

  componentDidMount() {
    const { url } = this.props
    this.fetch(url)
  }

  componentWillReceiveProps(nextProps) {
    const { url } = nextProps
    this.fetch(url)
  }

  fetch(url) {
    if (url) {
      window
        .fetch(url)
        .then(res => res.json())
        .then(responseJson => this.setState({ responseJson }))
    }
  }
}

const PullRequests = ({ pullRequests, org, repo }) => (
  <Fetch url={`/api/pull-requests?org=${org}&repo=${repo}`}>
    {({ pullRequests }) => (
      <div>
        <SectionHeader>Open pull requests</SectionHeader>
        <Spacer height="10px" />
        {addMargins(pullRequests.map(pr => <Pr pr={pr} key={pr._id} />))}
      </div>
    )}
  </Fetch>
)

export default PullRequests
