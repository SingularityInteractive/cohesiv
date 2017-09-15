import createPalette from 'material-ui/styles/createPalette'
import createBreakpoints from 'material-ui/styles/createBreakpoints'
import createMixins from 'material-ui/styles/createMixins'

import theme, { breakpoints } from './index'

const bk = createBreakpoints(breakpoints)

export default {
  direction: 'ltr',
  palette: createPalette(theme.palette),
  typography: theme.typography,
  mixins: createMixins(bk, theme.spacing),
  spacing: theme.spacing,
  breakpoints: bk,
  zIndex: theme.zIndex,
}
