import React, { Component } from 'react'
import { Div } from 'glamorous'

import Spacer from './spacer'
import SiteHeader from './site-header'
import SiteContent from './site-content'
import PullRequests from './pull-requests'
import ReviewTimes from './review-times'
import RevisionsByReviewer from './revisions-by-reviewer'
import RevisionsByAuthor from './revisions-by-author'

const App = ({ org, repo, setOrg, setRepo }) => {
  const readOnlyProps = { org, repo }

  return (
    <div>
      <SiteHeader {...{ org, repo, setOrg, setRepo }} />
      <SiteContent>
        {org &&
          repo &&
          <Div display="flex">
            <Div flex="1 0 0%">
              <ReviewTimes {...readOnlyProps} />
              <RevisionsByReviewer {...readOnlyProps} />
              <RevisionsByAuthor {...readOnlyProps} />
            </Div>
            <Spacer width="20px" />
            <Div flex="1 0 0%">
              <PullRequests {...readOnlyProps} />
            </Div>
          </Div>}
        {!org && <div>Please select an organization</div>}
        {org && !repo && <div>Please select a repo</div>}
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
}

class AppContainer extends Component {
  state = { org: '', repo: '' }

  render = () => (
    <App {...this.state} setOrg={this.setOrg} setRepo={this.setRepo} />
  )

  setOrg = org => this.setState({ org })
  setRepo = repo => this.setState({ repo })
}

export default AppContainer
