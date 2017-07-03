import React, { Component } from 'react'

import Pr from './pr'
import Spacer from './spacer'
import SectionHeader from './section-header'
import intersperse from './util/intersperse'
import Fetch from './util/fetch'

const addMargins = intersperse(i => <Spacer height="12px" key={i} />)

const PullRequests = ({ pullRequests, org, repo }) => (
  <Fetch url={`/api/pull-requests?org=${org}&repo=${repo}`}>
    {({ pullRequests = [] } = {}) => (
      <div>
        <SectionHeader>Open pull requests</SectionHeader>
        <Spacer height="10px" />
        {addMargins(
          pullRequests.map(pr => (
            <Pr org={org} repo={repo} pr={pr} key={pr._id} />
          ))
        )}
      </div>
    )}
  </Fetch>
)

export default PullRequests
