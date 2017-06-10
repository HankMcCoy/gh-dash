import React from 'react'
import { Div } from 'glamorous'

import Heading from './heading'

const SiteHeader = () => (
  <Div
    background="#336480"
    color="#fff"
    height="80px"
    display="flex"
    alignItems="center"
    paddingLeft="20px"
  >
    <Heading type="title">BuildingConnected/client</Heading>
  </Div>
)

export default SiteHeader
