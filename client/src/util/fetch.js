import React, { Component } from 'react'

export default class Fetch extends Component {
  state = { responseJson: undefined }

  render() {
    const { children, LoadingComponent } = this.props
    const { responseJson } = this.state

    return responseJson
      ? children(responseJson)
      : LoadingComponent ? <LoadingComponent /> : children()
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
