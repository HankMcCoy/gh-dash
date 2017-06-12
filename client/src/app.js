import React, { Component } from 'react'
import { Div } from 'glamorous'

import Spacer from './spacer'
import SiteHeader from './site-header'
import SiteContent from './site-content'
import PullRequests from './pull-requests'
import ReviewTimes from './review-times'
import RevisionsByReviewer from './revisions-by-reviewer'
import RevisionsByAuthor from './revisions-by-author'

const App = () => (
  <div>
    <SiteHeader />
    <SiteContent>
      <Div display="flex">
        <Div flex="1 0 0%">
          <ReviewTimes />
          <RevisionsByReviewer />
          <RevisionsByAuthor />
        </Div>
        <Spacer width="20px" />
        <Div flex="1 0 0%">
          <PullRequests />
        </Div>
      </Div>
    </SiteContent>
    <style>
      {`
body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
}
          `}
    </style>
  </div>
)

export default App
