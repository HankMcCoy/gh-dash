import React, { Component } from 'react'
import PullRequests from './pull-requests'
import RevisionsByReviewer from './revisions-by-reviewer'

class App extends Component {
  state = {
    pullRequests: undefined,
  }

  render() {
    const { pullRequests } = this.state

    const content = pullRequests
      ? <div>
          <RevisionsByReviewer />
          <PullRequests pullRequests={pullRequests} />
        </div>
      : null

    return (
      <div>
        {content}
        <style>
          {`
body {
  font-family: sans-serif;
}
          `}
        </style>
      </div>
    )
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

export default App
