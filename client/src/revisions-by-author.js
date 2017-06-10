import React, { Component } from 'react'
import { Div, Select } from 'glamorous'

import PullRequests from './pull-requests'
import SectionHeader from './section-header'
import Heading from './heading'
import Spacer from './spacer'
import Table from './table'

class RevisionsByAuthor extends Component {
  state = {
    author: undefined,
    authors: [],
    revisionsByAuthor: {},
  }

  render() {
    const { author, authors, revisionsByAuthor } = this.state
    const revisionsByCurrentAuthor = revisionsByAuthor[author] || []

    return (
      <div>
        <SectionHeader>
          <Div
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            width="100%"
          >
            <Heading type="primary">Revisions by author:</Heading>
            <Select
              value={author}
              onChange={this.handleAuthorChange}
              height="30px"
              fontSize="18px"
            >
              <option />
              {authors.map(r => <option value={r}>{r}</option>)}
            </Select>
          </Div>
        </SectionHeader>
        <Spacer height="10px" />
        <Table
          data={revisionsByCurrentAuthor}
          columns={[
            {
              header: 'Reviewer',
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
    window.fetch('/api/authors').then(res => res.json()).then(({ authors }) => {
      this.setState({ authors })
    })
  }

  handleAuthorChange = event => {
    const author = event.target.value
    this.setState({ author })

    window
      .fetch(`/api/revisions-by-author/${author}`)
      .then(res => res.json())
      .then(({ revisionCounts }) => {
        this.setState(prevState => ({
          revisionsByAuthor: {
            ...prevState.revisionsByAuthor,
            [author]: revisionCounts,
          },
        }))
      })
  }
}

export default RevisionsByAuthor
