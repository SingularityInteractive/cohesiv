import { Component } from 'react'
import Device from './Device'

export default class ResponsiveComponent extends Component {
  state = Device.dimensions
  subscription = Device.subscribeToDimensionChanges(dims => this.setState(dims))

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }
}
