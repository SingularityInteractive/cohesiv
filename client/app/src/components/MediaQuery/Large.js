import React from 'react'
import MediaQuery from './index'
import { breakpoints } from '../../theme'

export default function Large(props) {
  return <MediaQuery minWidth={breakpoints.lg}>{props.children}</MediaQuery>
}
