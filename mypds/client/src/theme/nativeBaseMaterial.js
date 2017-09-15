import color from 'color'
import { Platform, Dimensions, PixelRatio } from 'react-native'
import theme from './index'

const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width
const platform = Platform.OS
const platformStyle = 'material'

export default {
  platformStyle,
  platform,
  // AndroidRipple, setting to false so buttons use TouchableOpacity instead if TouchableNativeFeedback, which isn't
  androidRipple: platform !== 'web',
  androidRippleColor: 'rgba(256, 256, 256, 0.3)',
  androidRippleColorDark: 'rgba(0, 0, 0, 0.15)',

  // Badge
  badgeBg: theme.palette.common.darkBlack,
  badgeColor: theme.palette.common.fullWhite,
  // New Variable
  badgePadding: platform === 'ios' ? 3 : 0,

  // Button
  btnFontFamily: 'Roboto',
  btnDisabledBg: theme.palette.common.faintBlack,
  btnDisabledClr: theme.palette.shades.light.action.disabled,

  // CheckBox
  CheckboxRadius: 0,
  CheckboxBorderWidth: 0,
  CheckboxPaddingLeft: 0,
  CheckboxPaddingBottom: platform === 'ios' ? 0 : 5,
  CheckboxIconSize: platform === 'ios' ? 18 : 14,
  CheckboxIconMarginTop: platform === 'ios' ? undefined : 1,
  CheckboxFontSize: platform === 'ios' ? 21 : 18,
  DefaultFontSize: 16,
  checkboxBgColor: theme.palette.primary['500'],
  checkboxSize: 20,
  checkboxTickColor: theme.palette.common.white,

  // Segment
  segmentBackgroundColor: theme.palette.primary['500'],
  segmentActiveBackgroundColor: theme.palette.common.white,
  segmentTextColor: theme.palette.common.white,
  segmentActiveTextColor: theme.palette.primary['500'],
  segmentBorderColor: theme.palette.common.white,
  segmentBorderColorMain: theme.palette.primary['500'],

  // New Variable
  get defaultTextColor() {
    return this.textColor
  },

  get btnPrimaryBg() {
    return this.brandPrimary
  },
  get btnPrimaryColor() {
    return this.inverseTextColor
  },
  get btnInfoBg() {
    return this.brandInfo
  },
  get btnInfoColor() {
    return this.inverseTextColor
  },
  get btnSuccessBg() {
    return this.brandSuccess
  },
  get btnSuccessColor() {
    return this.inverseTextColor
  },
  get btnDangerBg() {
    return this.brandDanger
  },
  get btnDangerColor() {
    return this.inverseTextColor
  },
  get btnWarningBg() {
    return this.brandWarning
  },
  get btnWarningColor() {
    return this.inverseTextColor
  },
  get btnTextSize() {
    return platform === 'ios' ? this.fontSizeBase * 1.1 : this.fontSizeBase - 1
  },
  get btnTextSizeLarge() {
    return this.fontSizeBase * 1.5
  },
  get btnTextSizeSmall() {
    return this.fontSizeBase * 0.8
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8
  },

  buttonPadding: 6,

  get iconSizeLarge() {
    return this.iconFontSize * 1.5
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6
  },

  // Card
  cardDefaultBg: theme.palette.background.paper,

  // Color
  brandPrimary: theme.palette.primary['500'],
  brandInfo: theme.palette.grey['500'],
  brandSuccess: theme.palette.accent['500'],
  brandDanger: theme.palette.error['500'],
  brandWarning: theme.palette.warning['500'],
  brandSidebar: '#252932',

  // Font
  fontFamily: 'Roboto',
  fontSizeBase: theme.typography.fontSize,

  get fontSizeH1() {
    return this.fontSizeBase * 1.8
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4
  },

  // Footer
  footerHeight: 56,
  footerDefaultBg: theme.palette.shades.light.background.paper,

  // FooterTab
  tabBarTextColor: theme.palette.shades.light.text.secondary,
  tabBarTextSize: theme.typography.fontSize,
  activeTab: theme.palette.primary['500'],
  sTabBarActiveTextColor: '#007aff',
  tabBarActiveTextColor: theme.palette.primary['500'],
  tabActiveBgColor: undefined,

  // Tab
  tabDefaultBg: theme.palette.primary['500'],
  topTabBarTextColor: theme.palette.shades.dark.action.disabled,
  topTabBarActiveTextColor: theme.palette.shades.dark.action.active,
  topTabActiveBgColor: undefined,
  topTabBarBorderColor: theme.palette.common.white,
  topTabBarActiveBorderColor: theme.palette.common.white,

  // Header
  toolbarBtnColor: theme.palette.common.white,
  toolbarDefaultBg: theme.palette.primary['500'],
  toolbarHeight: 64,
  toolbarIconSize: 24,
  toolbarSearchIconSize: 24,
  toolbarInputColor: theme.palette.common.white,
  searchBarHeight: 35,
  toolbarInverseBg: '#222',
  toolbarTextColor: theme.palette.common.white,
  toolbarDefaultBorder: theme.palette.primary['500'],
  iosStatusbar: 'light-content',
  get statusBarColor() {
    return color(this.toolbarDefaultBg)
      .darken(0.2)
      .hex()
  },

  // Icon
  iconFamily: 'MaterialIcons',
  iconFontSize: platform === 'ios' ? 30 : 28,
  iconMargin: 7,
  iconHeaderSize: platform === 'ios' ? 29 : 24,

  // InputGroup
  inputFontSize: 17,
  inputBorderColor: '#D9D5DC',
  inputSuccessBorderColor: '#2b8339',
  inputErrorBorderColor: '#ed2f2f',

  get inputColor() {
    return this.textColor
  },
  get inputColorPlaceholder() {
    return theme.palette.input.helperText
  },

  inputGroupMarginBottom: 10,
  inputHeightBase: 50,
  inputPaddingLeft: 5,

  get inputPaddingLeftIcon() {
    return this.inputPaddingLeft * 8
  },

  // Line Height
  btnLineHeight: 19,
  lineHeightH1: 32,
  lineHeightH2: 27,
  lineHeightH3: 22,
  iconLineHeight: platform === 'ios' ? 37 : 30,
  lineHeight: platform === 'ios' ? 20 : 24,

  // List
  listBorderColor: '#c9c9c9',
  listDividerBg: '#f4f4f4',
  listItemHeight: 45,
  listBtnUnderlayColor: '#DDD',
  listBg: theme.palette.background.paper,

  // Card
  cardBorderColor: '#ccc',

  // Changed Variable
  listItemPadding: platform === 'ios' ? 10 : 12,

  listNoteColor: '#808080',
  listNoteSize: 13,

  // Progress Bar
  defaultProgressColor: '#E4202D',
  inverseProgressColor: '#1A191B',

  // Radio Button
  radioBtnSize: platform === 'ios' ? 25 : 23,
  radioSelectedColorAndroid: '#5067FF',

  // New Variable
  radioBtnLineHeight: platform === 'ios' ? 29 : 24,

  radioColor: '#7e7e7e',

  get radioSelectedColor() {
    return color(this.radioColor)
      .darken(0.2)
      .hex()
  },

  // Spinner
  defaultSpinnerColor: theme.palette.primary['500'],
  inverseSpinnerColor: color(theme.palette.primary['500']).negate,

  // Tabs
  tabBgColor: '#F8F8F8',
  tabFontSize: 15,
  tabTextColor: '#222222',

  // Text
  textColor: theme.typography.body1.color,
  inverseTextColor: color(theme.typography.body1.color).negate(),
  noteFontSize: theme.typography.caption.fontSize,

  // Title
  titleFontfamily: 'Roboto',
  titleFontSize: theme.typography.title.fontSize,
  subTitleFontSize: theme.typography.subheading.fontSize,
  subtitleColor: theme.typography.subheading.color,

  // New Variable
  titleFontColor: theme.typography.title.color,

  // Other
  borderRadiusBase: 2,
  borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  contentPadding: 10,

  get darkenHeader() {
    return color(this.tabBgColor)
      .darken(0.03)
      .hex()
  },

  dropdownBg: '#000',
  dropdownLinkColor: '#414142',
  inputLineHeight: 24,
  jumbotronBg: '#C9C9CE',
  jumbotronPadding: 30,
  deviceWidth,
  deviceHeight,

  // New Variable
  inputGroupRoundedBorderRadius: 30
}
