import React from 'react'

import Pr from './pr'
import Spacer from './spacer'
import intersperse from './util/intersperse'

const addMargins = intersperse(<Spacer height="20px" />)

const PullRequests = ({ pullRequests }) => (
  <div>
    <h1>Pull Requests</h1>
    {addMargins(pullRequests.map(pr => <Pr pr={pr} />))}
  </div>
)

export default PullRequests
