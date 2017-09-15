import React from 'react'
import MediaQuery from './index'
import { breakpoints } from '../../theme'

export default function Medium(props) {
  return <MediaQuery minWidth={breakpoints.sm}>{props.children}</MediaQuery>
}
