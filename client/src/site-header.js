import React, { Component } from 'react'
import { Div } from 'glamorous'

import Heading from './heading'

const SiteHeader = ({ orgs, repos }) => (
  <Div
    background="#336480"
    color="#fff"
    height="80px"
    display="flex"
    alignItems="center"
    paddingLeft="20px"
  >
    {orgs && repos
      ? <div>
          <select name="org">
            {orgs.map(org => <option value={org} key={org}>{org}</option>)}
          </select>
          <select name="repo">
            {repos.map(repo => <option value={repo} key={repo}>{repo}</option>)}
          </select>
        </div>
      : 'Loading…'}
  </Div>
)

class SiteHeaderContainer extends Component {
  state = { orgs: [], repos: [] }

  constructor() {
    super()

    this.state = { orgs: [], repos: [] }
  }

  render = () => <SiteHeader {...this.state} />

  componentDidMount() {
    Promise.all([
      window.fetch('/api/orgs').then(res => res.json()),
      window.fetch('/api/repos').then(res => res.json()),
    ]).then(([{ orgs }, { repos }]) => {
      this.setState({ orgs, repos })
    })
  }
}

export default SiteHeaderContainer
