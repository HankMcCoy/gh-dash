import React, { Component } from 'react'
import { Div } from 'glamorous'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryStack } from 'victory'

import SectionHeader from './section-header'
import Spacer from './spacer'
import Fetch from './util/fetch'

const colorScale = ['#193A54', '#31708F', '#4DAAA7']
const colorLabels = ['Before', 'In review', 'After review']

const ColorLegend = ({ color, label, isLast }) => (
  <Div
    alignItems="center"
    display="flex"
    flex="0 0 auto"
    marginRight={isLast ? 0 : '10px'}
  >
    <Div height="15px" width="15px" background={color} />
    <Spacer width="5px" />
    <Div>{label}</Div>
  </Div>
)

const ReviewTimes = ({ org, repo, startDate }) => {
  return (
    <Fetch
      url={`/api/review-times?org=${org}&repo=${repo}&startDate=${startDate}`}
    >
      {({ reviewTimes } = {}) => {
        return (
          <div>
            <SectionHeader>
              Avg time waiting for PRs (by week)
            </SectionHeader>
            <Spacer height="10px" />
            <Div height="600px">
              {reviewTimes
                ? <VictoryChart domainPadding={20} height={600}>
                    <VictoryAxis
                      tickValues={reviewTimes.map(t => t._id)}
                      tickFormat={reviewTimes.map(t => `Week ${t._id}`)}
                    />
                    <VictoryAxis
                      dependentAxis
                      tickFormat={x => `${Math.round(x / 1000 / 60 / 60)} hrs`}
                    />
                    <VictoryStack
                      offset={8}
                      style={{ data: { width: 16 } }}
                      colorScale={colorScale}
                    >
                      <VictoryBar
                        data={reviewTimes}
                        x="_id"
                        y="waitingForReview"
                      />
                      <VictoryBar
                        data={reviewTimes}
                        x="_id"
                        y="spentInReview"
                      />
                      <VictoryBar
                        data={reviewTimes}
                        x="_id"
                        y="afterReviewBeforeMerge"
                      />
                    </VictoryStack>
                  </VictoryChart>
                : 'Loading…'}
            </Div>
            <Div display="flex" width="300px" margin="0 auto">
              {colorScale.map((color, i) => (
                <ColorLegend
                  color={color}
                  label={colorLabels[i]}
                  key={i}
                  isLast={i == colorScale.length - 1}
                />
              ))}
            </Div>
            <Spacer height="20px" />
          </div>
        )
      }}
    </Fetch>
  )
}

export default ReviewTimes
