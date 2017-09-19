import variable from '../nativeBaseMaterial'

export default (variables = variable) => {
  const viewTheme = {
    '.padder': {
      padding: variables.contentPadding
    }
  }

  return viewTheme
}
