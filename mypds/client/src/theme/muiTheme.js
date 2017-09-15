import createPalette from 'material-ui/styles/palette'
import createBreakpoints from 'material-ui/styles/breakpoints'
import createMixins from 'material-ui/styles/mixins'

import theme, { breakpoints } from './index'

const bk = createBreakpoints(breakpoints)

export default {
  direction: 'ltr',
  palette: createPalette(theme.palette),
  typography: theme.typography,
  mixins: createMixins(bk, theme.spacing),
  spacing: theme.spacing,
  breakpoints: bk,
  zIndex: theme.zIndex
}
