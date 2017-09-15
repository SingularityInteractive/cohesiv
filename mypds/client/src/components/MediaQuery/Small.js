import React from 'react'
import MediaQuery from './index'
import { breakpoints } from '../../theme'

export default function Small(props) {
  return (
    <MediaQuery minWidth={1} maxWidth={breakpoints.sm}>
      {props.children}
    </MediaQuery>
  )
}
