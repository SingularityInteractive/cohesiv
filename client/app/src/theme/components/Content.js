import variable from '../nativeBaseMaterial'
import theme from '../index'

export default (variables = variable) => {
  const contentTheme = {
    '.padder': {
      padding: variables.contentPadding
    },
    flex: 1,
    backgroundColor: theme.palette.shades.light.background.default,
    'NativeBase.Segment': {
      borderWidth: 0,
      backgroundColor: 'transparent'
    },
    'NativeBase.Separator': {
      backgroundColor: 'transparent',
      paddingLeft: 0
    }
  }

  return contentTheme
}
