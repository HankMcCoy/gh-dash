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

const RevisionsByReviewer = ({ reviewer, reviewers, setReviewer, org, repo }) => {
  return (
    <Fetch url="/api/reviewers">
      {({ reviewers = [] } = {}) => (
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
                onChange={e => setReviewer(e.target.value)}
                height="30px"
                fontSize="18px"
              >
                <option />
                {reviewers.map(r => <option value={r} key={r}>{r}</option>)}
              </Select>
            </Div>
          </SectionHeader>
          {reviewer
            ? <Fetch
                url={`/api/revisions-by-reviewer/${reviewer}?org=${org}&repo=${repo}`}
              >
                {({ revisionCounts } = {}) => {
                  return (
                    <RevisionsTable
                      revisionCounts={revisionCounts}
                      type="Reviewer"
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

export default withState('reviewer', 'setReviewer', '')(RevisionsByReviewer)
