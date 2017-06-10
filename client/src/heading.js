import React from 'react'
import glamorous, { H1, H2, H3 } from 'glamorous'

const headingComponents = {
  title: H1,
  primary: H2,
  secondary: H3,
}
const sizes = {
  title: '36px',
  primary: '24px',
  secondary: '18px',
}

const Heading = props => {
  const Component = headingComponents[props.type]

  return (
    <Component margin="0" fontSize={sizes[props.type]} fontWeight="400">
      {props.children}
    </Component>
  )
}

export default Heading
