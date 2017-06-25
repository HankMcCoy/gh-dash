import React, { Component } from 'react'
import { Div } from 'glamorous'

import Heading from './heading'

const SiteHeader = ({ org, repo, orgs, repos, setOrg, setRepo }) => (
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
          <select name="org" onChange={e => setOrg(e.target.value)} value={org}>
            <option />
            {orgs.map(org => <option value={org} key={org}>{org}</option>)}
          </select>
          <select
            name="repo"
            onChange={e => setRepo(e.target.value)}
            value={repo}
          >
            <option />
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

  render = () => <SiteHeader {...this.state} {...this.props} />

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
