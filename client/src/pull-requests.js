import React from 'react'

import Pr from './pr'
import Spacer from './spacer'
import intersperse from './util/intersperse'

const addMargins = intersperse(i => <Spacer height="20px" key={i} />)

const PullRequests = ({ pullRequests }) => (
  <div>
    <h1>Pull Requests</h1>
    {addMargins(pullRequests.map(pr => <Pr pr={pr} key={pr._id} />))}
  </div>
)

export default PullRequests
