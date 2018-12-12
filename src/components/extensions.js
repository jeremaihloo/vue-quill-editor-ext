import _Quill from 'quill'
const Quill = window.Quill || _Quill

// 字体大小，以px为单位
const sizeStyle = Quill.import('attributors/style/size')
const sizeList = [
  '10px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '30px',
  '32px',
  '34px',
  '36px'
]
sizeStyle.whitelist = sizeList

// 行高
const Parchment = Quill.import('parchment')
const lineHeightList = [
  '1.0',
  '1.2',
  '1.4',
  '1.6',
  '1.8',
  '2.0',
  '2.4',
  '2.6',
  '2.8',
  '3.0',
  '4.0',
  '5.0'
]
const lineHeightConfig = {
  scope: Parchment.Scope.INLINE,
  whitelist: lineHeightList
}
const lineHeightClass = new Parchment.Attributor.Class(
  'lineheight',
  'ql-lineheight',
  lineHeightConfig
)
const lineHeightStyle = new Parchment.Attributor.Style(
  'lineheight',
  'line-height',
  lineHeightConfig
)

// 字间距
const letterSpacingList = [
  '0px',
  '1px',
  '2px',
  '3px',
  '4px',
  '5px',
  '6px',
  '7px',
  '8px',
  '9px',
  '10px'
]
const letterSpacingConfig = {
  scope: Parchment.Scope.INLINE,
  whitelist: letterSpacingList
}
const letterSpacingClass = new Parchment.Attributor.Class(
  'letterspacing',
  'ql-letterspacing',
  letterSpacingConfig
)
const letterSpacingStyle = new Parchment.Attributor.Style(
  'letterspacing',
  'letter-spacing',
  letterSpacingConfig
)

const register = () => {
  Quill.register(sizeStyle, true)
  Parchment.register(lineHeightClass)
  Parchment.register(lineHeightStyle)
  Parchment.register(letterSpacingClass)
  Parchment.register(letterSpacingStyle)
}

export default {
  sizeList,
  sizeStyle,
  lineHeightClass,
  lineHeightStyle,
  lineHeightList,
  letterSpacingClass,
  letterSpacingStyle,
  letterSpacingList,
  register
}
