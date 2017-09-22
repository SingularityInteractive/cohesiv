export const FONT_NAME = 'Open Sans'

export const breakpoints = {
  xs: 360,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920
}

export default {
  direction: 'ltr',
  palette: {
    common: {
      black: '#000',
      white: '#fff',
      transparent: 'rgba(0, 0, 0, 0)',
      fullBlack: 'rgba(0, 0, 0, 1)',
      darkBlack: 'rgba(0, 0, 0, 0.87)',
      lightBlack: 'rgba(0, 0, 0, 0.54)',
      minBlack: 'rgba(0, 0, 0, 0.26)',
      faintBlack: 'rgba(0, 0, 0, 0.12)',
      fullWhite: 'rgba(255, 255, 255, 1)',
      darkWhite: 'rgba(255, 255, 255, 0.87)',
      lightWhite: 'rgba(255, 255, 255, 0.54)'
    },
    type: 'light',
    shades: {
      dark: {
        text: {
          primary: 'rgba(255, 255, 255, 1)',
          secondary: 'rgba(255, 255, 255, 0.7)',
          disabled: 'rgba(255, 255, 255, 0.5)',
          hint: 'rgba(255, 255, 255, 0.5)',
          icon: 'rgba(255, 255, 255, 0.5)',
          divider: 'rgba(255, 255, 255, 0.12)',
          lightDivider: 'rgba(255, 255, 255, 0.075)'
        },
        input: {
          bottomLine: 'rgba(255, 255, 255, 0.7)',
          helperText: 'rgba(255, 255, 255, 0.7)',
          labelText: 'rgba(255, 255, 255, 0.7)',
          inputText: 'rgba(255, 255, 255, 1)',
          disabled: 'rgba(255, 255, 255, 0.5)'
        },
        action: {
          active: 'rgba(255, 255, 255, 1)',
          disabled: 'rgba(255, 255, 255, 0.3)'
        },
        background: {
          default: '#303030',
          paper: '#424242',
          appBar: '#212121',
          contentFrame: '#212121',
          status: '#000'
        }
      },
      light: {
        text: {
          primary: 'rgba(0, 0, 0, 0.87)',
          secondary: 'rgba(0, 0, 0, 0.54)',
          disabled: 'rgba(0, 0, 0, 0.38)',
          hint: 'rgba(0, 0, 0, 0.38)',
          icon: 'rgba(0, 0, 0, 0.38)',
          divider: 'rgba(0, 0, 0, 0.12)',
          lightDivider: 'rgba(0, 0, 0, 0.075)'
        },
        input: {
          bottomLine: 'rgba(0, 0, 0, 0.42)',
          helperText: 'rgba(0, 0, 0, 0.54)',
          labelText: 'rgba(0, 0, 0, 0.54)',
          inputText: 'rgba(0, 0, 0, 0.87)',
          disabled: 'rgba(0, 0, 0, 0.42)'
        },
        action: {
          active: 'rgba(0, 0, 0, 0.54)',
          disabled: 'rgba(0, 0, 0, 0.26)'
        },
        background: {
          default: '#fafafa',
          paper: '#fff',
          appBar: '#f5f5f5',
          contentFrame: '#eeeeee'
        }
      }
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.38)',
      hint: 'rgba(0, 0, 0, 0.38)',
      icon: 'rgba(0, 0, 0, 0.38)',
      divider: 'rgba(0, 0, 0, 0.12)',
      lightDivider: 'rgba(0, 0, 0, 0.075)'
    },
    input: {
      bottomLine: 'rgba(0, 0, 0, 0.42)',
      helperText: 'rgba(0, 0, 0, 0.54)',
      labelText: 'rgba(0, 0, 0, 0.54)',
      inputText: 'rgba(0, 0, 0, 0.87)',
      disabled: 'rgba(0, 0, 0, 0.42)'
    },
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      disabled: 'rgba(0, 0, 0, 0.26)'
    },
    background: {
      default: '#fafafa',
      paper: '#fff',
      appBar: '#f5f5f5',
      contentFrame: '#eeeeee'
    },
    primary: {
      '50': '#e3f2fd',
      '100': '#bbdefb',
      '200': '#90caf9',
      '300': '#64b5f6',
      '400': '#42a5f5',
      '500': '#2196f3',
      '600': '#1e88e5',
      '700': '#1976d2',
      '800': '#1565c0',
      '900': '#0d47a1',
      A100: '#82b1ff',
      A200: '#448aff',
      A400: '#2979ff',
      A700: '#2962ff',
      contrastDefaultColor: 'light'
    },
    accent: {
      '50': '#fce4ec',
      '100': '#f8bbd0',
      '200': '#f48fb1',
      '300': '#f06292',
      '400': '#ec407a',
      '500': '#e91e63',
      '600': '#d81b60',
      '700': '#c2185b',
      '800': '#ad1457',
      '900': '#880e4f',
      A100: '#ff80ab',
      A200: '#ff4081',
      A400: '#f50057',
      A700: '#c51162',
      contrastDefaultColor: 'light'
    },
    error: {
      '50': '#ffebee',
      '100': '#ffcdd2',
      '200': '#ef9a9a',
      '300': '#e57373',
      '400': '#ef5350',
      '500': '#f44336',
      '600': '#e53935',
      '700': '#d32f2f',
      '800': '#c62828',
      '900': '#b71c1c',
      A100: '#ff8a80',
      A200: '#ff5252',
      A400: '#ff1744',
      A700: '#d50000',
      contrastDefaultColor: 'light'
    },
    warning: {
      '500': '#f0ad4e'
    },
    grey: {
      '50': '#fafafa',
      '100': '#f5f5f5',
      '200': '#eeeeee',
      '300': '#e0e0e0',
      '400': '#bdbdbd',
      '500': '#9e9e9e',
      '600': '#757575',
      '700': '#616161',
      '800': '#424242',
      '900': '#212121',
      A100: '#d5d5d5',
      A200: '#aaaaaa',
      A400: '#303030',
      A700: '#616161',
      contrastDefaultColor: 'dark'
    }
  },
  typography: {
    fontFamily: `'${FONT_NAME}', sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    display4: {
      fontSize: 112,
      fontWeight: 300,
      fontFamily: `'${FONT_NAME}', sans-serif`,
      letterSpacing: '-.04em',
      lineHeight: 1,
      color: 'rgba(0, 0, 0, 0.54)'
    },
    display3: {
      fontSize: 56,
      fontWeight: 400,
      fontFamily: `'${FONT_NAME}', sans-serif`,
      letterSpacing: '-.02em',
      lineHeight: 1.35,
      color: 'rgba(0, 0, 0, 0.54)'
    },
    display2: {
      fontSize: 45,
      fontWeight: 400,
      fontFamily: `'${FONT_NAME}', sans-serif`,
      lineHeight: '48px',
      color: 'rgba(0, 0, 0, 0.54)'
    },
    display1: {
      fontSize: 34,
      fontWeight: 400,
      fontFamily: `'${FONT_NAME}', sans-serif`,
      lineHeight: '40px',
      color: 'rgba(0, 0, 0, 0.54)'
    },
    headline: {
      fontSize: 24,
      fontWeight: 400,
      fontFamily: `'${FONT_NAME}', sans-serif`,
      lineHeight: '32px',
      color: 'rgba(0, 0, 0, 0.87)'
    },
    title: {
      fontSize: 21,
      fontWeight: 500,
      fontFamily: `'${FONT_NAME}', sans-serif`,
      lineHeight: 1,
      color: 'rgba(0, 0, 0, 0.87)'
    },
    subheading: {
      fontSize: 16,
      fontWeight: 400,
      fontFamily: `'${FONT_NAME}', sans-serif`,
      lineHeight: '24px',
      color: 'rgba(0, 0, 0, 0.87)'
    },
    body2: {
      fontSize: 14,
      fontWeight: 500,
      fontFamily: `'${FONT_NAME}', sans-serif`,
      lineHeight: '24px',
      color: 'rgba(0, 0, 0, 0.87)'
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
      fontFamily: `'${FONT_NAME}', sans-serif`,
      lineHeight: '20px',
      color: 'rgba(0, 0, 0, 0.87)'
    },
    caption: {
      fontSize: 12,
      fontWeight: 400,
      fontFamily: `'${FONT_NAME}', sans-serif`,
      lineHeight: 1,
      color: 'rgba(0, 0, 0, 0.54)'
    },
    button: {
      fontSize: 14,
      textTransform: 'uppercase',
      fontWeight: 500,
      fontFamily: `'${FONT_NAME}', sans-serif`
    }
  },
  spacing: {
    unit: 8
  },
  zIndex: {
    mobileStepper: 900,
    menu: 1000,
    appBar: 1100,
    drawerOverlay: 1200,
    navDrawer: 1300,
    dialogOverlay: 1400,
    dialog: 1500,
    layer: 2000,
    popover: 2100,
    snackbar: 2900,
    tooltip: 3000
  }
}
