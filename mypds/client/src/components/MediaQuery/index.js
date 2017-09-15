import MediaQuerySelector from './MediaQuerySelector'
import ResponsiveComponent from './ResponsiveComponent'
import Device from './Device'

export default class MediaQuery extends ResponsiveComponent {
  constructor(props) {
    super(props)
    this.state = Device.dimensions
  }

  render() {
    const { width, height } = this.state.window
    const val = MediaQuerySelector.query(this.props, width, height)
    if (val) {
      return this.props.children
    } else {
      return null
    }
  }
}
