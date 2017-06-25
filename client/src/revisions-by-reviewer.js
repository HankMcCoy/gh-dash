import React, { Component } from 'react'
import { Div, Select } from 'glamorous'

import PullRequests from './pull-requests'
import SectionHeader from './section-header'
import Heading from './heading'
import Spacer from './spacer'
import Table from './table'

class RevisionsByReviewer extends Component {
  state = {
    reviewer: undefined,
    reviewers: [],
    revisionsByReviewer: {},
  }

  render() {
    const { reviewer, reviewers, revisionsByReviewer } = this.state
    const revisionsByCurrentReviewer = revisionsByReviewer[reviewer] || []

    const totalPrsReviewed = _.values(revisionsByCurrentReviewer).reduce(
      (total, { count }) => total + count,
      0
    )
    const totalRevisions = _.values(revisionsByCurrentReviewer).reduce(
      (total, { numRevisions }) => total + numRevisions,
      0
    )
    const overallAvgRevisions = totalRevisions / totalPrsReviewed
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
              {reviewers.map(r => <option value={r} key={r}>{r}</option>)}
            </Select>
          </Div>
        </SectionHeader>
        <Spacer height="10px" />
        <div>Overall avg revisions: {overallAvgRevisions.toFixed(2)}</div>
        <Spacer height="10px" />
        <Table
          data={revisionsByCurrentReviewer}
          columns={[
            {
              header: 'Author',
              renderCell: ({ _id }) => _id,
              flex: '0 1 150px',
            },
            { header: '#', renderCell: ({ count }) => count, flex: '0 0 45px' },
            {
              header: 'Avg Revisions',
              renderCell: ({ count, numRevisions }) =>
                (numRevisions / count).toFixed(2),
              flex: '1 0 50px',
            },
          ]}
        />
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
    const { org, repo } = this.props
    const reviewer = event.target.value
    this.setState({ reviewer })

    window
      .fetch(`/api/revisions-by-reviewer/${reviewer}?org=${org}&repo=${repo}`)
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
