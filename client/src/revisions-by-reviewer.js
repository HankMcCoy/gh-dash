import React, { Component } from 'react'
import { Div, Select } from 'glamorous'

import PullRequests from './pull-requests'
import SectionHeader from './section-header'
import Heading from './heading'

class RevisionsByReviewer extends Component {
  state = {
    reviewer: undefined,
    reviewers: [],
    revisionsByReviewer: {},
  }

  render() {
    const { reviewer, reviewers, revisionsByReviewer } = this.state
    const revisionsByCurrentReviewer = revisionsByReviewer[reviewer] || []

    return (
      <div>
        <SectionHeader>
          <Div
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            width="100%"
          >
            <Heading type="primary">Revisions by reviewer:</Heading>
            <Select
              value={reviewer}
              onChange={this.handleReviewerChange}
              height="30px"
              fontSize="18px"
            >
              <option />
              {reviewers.map(r => <option value={r}>{r}</option>)}
            </Select>
          </Div>
        </SectionHeader>
        {revisionsByCurrentReviewer.map(({ _id, numRevisions, count }) => {
          return (
            <div>
              <h3>{_id}</h3>
              <div>Total: {count}</div>
              <div>Avg rev: {(numRevisions / count).toFixed(2)}</div>
            </div>
          )
        })}
      </div>
    )
  }

  componentDidMount() {
    window
      .fetch('/api/reviewers')
      .then(res => res.json())
      .then(({ reviewers }) => {
        this.setState({ reviewers })
      })
  }

  handleReviewerChange = event => {
    const reviewer = event.target.value
    this.setState({ reviewer })

    window
      .fetch(`/api/revisions-by-reviewer/${reviewer}`)
      .then(res => res.json())
      .then(({ revisionCounts }) => {
        this.setState(prevState => ({
          revisionsByReviewer: {
            ...prevState.revisionsByReviewer,
            [reviewer]: revisionCounts,
          },
        }))
      })
  }
}

export default RevisionsByReviewer
