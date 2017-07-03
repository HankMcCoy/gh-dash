import _ from 'lodash'
import React, { Component } from 'react'

import Pr from './pr'
import Spacer from './spacer'
import SectionHeader from './section-header'
import intersperse from './util/intersperse'
import Fetch from './util/fetch'
import Table from './table'

const LeaderBoard = ({ type, org, repo, startDate }) => (
  <Fetch
    url={`/api/${type}-leader-board?org=${org}&repo=${repo}&startDate=${startDate}`}
  >
    {({ results = [] } = {}) => (
      <div>
        <SectionHeader>{`${_.capitalize(type)} Leader Board`}</SectionHeader>
        <Spacer height="10px" />
        <Table
          data={results}
          columns={[
            {
              header: type,
              key: type === 'author' ? 'author' : 'gtgReviewer',
              flex: '0 1 150px',
            },
            {
              header: '#',
              key: 'count',
              flex: '0 0 45px',
            },
            {
              header: 'Min LOC',
              key: 'minLoc',
              flex: '1 0 50px',
            },
            {
              header: 'Avg LOC',
              key: 'avgLoc',
              renderCell: value => Math.round(value),
              flex: '1 0 50px',
            },
            {
              header: 'Median LOC',
              key: 'medianLoc',
              flex: '1 0 50px',
            },
            {
              header: 'Max LOC',
              key: 'maxLoc',
              flex: '1 0 50px',
            },
            {
              header: 'Avg Revisions',
              key: 'avgRevisions',
              renderCell: value => value.toFixed(2),
              flex: '1 0 50px',
            },
          ]}
        />
      </div>
    )}
  </Fetch>
)

export default LeaderBoard
