import React, { Component } from 'react'
import { Div } from 'glamorous'
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory'

import SectionHeader from './section-header'
import Spacer from './spacer'

class ReviewTimes extends Component {
  state = {
    timeWaitingForReviewByWeek: undefined,
  }

  render() {
    const { timeWaitingForReviewByWeek } = this.state

    return (
      <div>
        <SectionHeader>
          Time waiting for review (by week)
        </SectionHeader>
        <Spacer height="10px" />
        <Div height="300px">
          {timeWaitingForReviewByWeek
            ? <VictoryChart domainPadding={20}>
                <VictoryAxis
                  tickFormat={timeWaitingForReviewByWeek.map(
                    t => `Week ${t._id}`
                  )}
                />
                <VictoryAxis
                  dependentAxis
                  tickFormat={x => `${Math.round(x / 1000 / 60 / 60)} hrs`}
                />
                <VictoryBar
                  data={timeWaitingForReviewByWeek}
                  x="_id"
                  y="avgTimeWaitingForReview"
                />
              </VictoryChart>
            : 'Loading…'}
        </Div>
      </div>
    )
  }

  componentDidMount() {
    window
      .fetch('/api/review-times')
      .then(res => res.json())
      .then(({ reviewTimes }) => {
        this.setState({
          timeWaitingForReviewByWeek: reviewTimes.waitingForReview,
        })
      })
  }
}

export default ReviewTimes
