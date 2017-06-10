import React from 'react'
import { Div } from 'glamorous'

import Heading from './heading'

const SectionHeader = ({ children }) => {
  return (
    <Div
      borderBottom="1px solid #BDBDBD"
      height="40px"
      display="flex"
      alignItems="center"
    >
      {typeof children === 'string'
        ? <Heading type="primary">{children}</Heading>
        : children}
    </Div>
  )
}

export default SectionHeader
