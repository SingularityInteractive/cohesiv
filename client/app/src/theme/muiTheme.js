import createPalette from 'material-ui/styles/createPalette'
import createBreakpoints from 'material-ui/styles/createBreakpoints'
import createMixins from 'material-ui/styles/createMixins'

import theme, { breakpoints } from './index'

const bk = createBreakpoints(breakpoints)

// console.log('dafuq is this', createPalette(theme.palette))

// palette generated from http://mcg.mbitson.com/#!?cohesivbase=%23222222
const cohesivBase = {
  primary: {
    50: '#e4e4e4',
    100: '#bdbdbd',
    200: '#919191',
    300: '#646464',
    400: '#434343',
    500: '#222222',
    600: '#1e1e1e',
    700: '#191919',
    800: '#141414',
    900: '#0c0c0c',
    A100: '#e76c6c',
    A200: '#e04040',
    A400: '#ec0000',
    A700: '#d30000',
    contrastDefaultColor: 'light'
  }
}

export default {
  direction: 'ltr',
  palette: createPalette(cohesivBase),
  typography: theme.typography,
  mixins: createMixins(bk, theme.spacing),
  spacing: theme.spacing,
  breakpoints: bk,
  zIndex: theme.zIndex
}
