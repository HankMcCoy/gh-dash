import _ from 'lodash'
import React, { Component } from 'react'
import { Div, Select } from 'glamorous'
import { withState } from 'recompose'

import Fetch from './util/fetch'
import PullRequests from './pull-requests'
import SectionHeader from './section-header'
import Heading from './heading'
import Spacer from './spacer'
import RevisionsTable from './revisions-table'

const RevisionsByAuthor = ({ author, authors, setAuthor, org, repo }) => {
  return (
    <Fetch url="/api/authors">
      {({ authors = [] } = {}) => (
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
                onChange={e => setAuthor(e.target.value)}
                height="30px"
                fontSize="18px"
              >
                <option />
                {authors.map(r => <option value={r} key={r}>{r}</option>)}
              </Select>
            </Div>
          </SectionHeader>
          {author
            ? <Fetch
                url={`/api/revisions-by-author/${author}?org=${org}&repo=${repo}`}
              >
                {({ revisionCounts } = {}) => {
                  return (
                    <RevisionsTable
                      revisionCounts={revisionCounts}
                      type="Author"
                    />
                  )
                }}
              </Fetch>
            : null}
        </div>
      )}
    </Fetch>
  )
}

export default withState('author', 'setAuthor', '')(RevisionsByAuthor)
