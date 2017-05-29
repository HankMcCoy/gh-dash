import React, { Component } from 'react'
import PullRequests from './pull-requests'

class App extends Component {
  state = {
    pullRequests: undefined,
  }

  render() {
    const { pullRequests } = this.state

    const content = pullRequests
      ? <PullRequests pullRequests={pullRequests} />
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
