_ = require 'lodash'

defaultOptions =
  maxFontPixels: 40
  minFontPixels: 4
  widthOnly: false
  explicitWidth: null
  explicitHeight: null
  changeLineHeight: false

textfill = (el, options) ->
  options = _.defaults {}, options, defaultOptions

  text = el.children[0]
  maxHeight = options.explicitHeight || el.clientHeight
  maxWidth = options.explicitWidth || el.clientWidth
  style = getComputedStyle text
  lineHeight = parseFloat(style.lineHeight) / parseFloat(style.fontSize)

  newSizing = (prop, max) ->
    {minFontPixels, maxFontPixels} = options

    while minFontPixels < maxFontPixels - 1
      fontSize = Math.floor (minFontPixels + maxFontPixels) / 2
      text.style.fontSize = fontSize + 'px'
      if text[prop] <= max
        minFontPixels = fontSize
        break if text[prop] == max
      else
        maxFontPixels = fontSize

    minFontPixels = maxFontPixels if text[prop] <= max

    minFontPixels

  fontSizeHeight = newSizing 'offsetHeight', maxHeight unless options.widthOnly
  fontSizeWidth = newSizing 'offsetWidth', maxWidth
  fontSizeFinal = if options.widthOnly then fontSizeWidth else Math.min(fontSizeHeight, fontSizeWidth)

  text.style.fontSize = fontSizeFinal + 'px'
  el.style.lineHeight = lineHeight * fontSizeFinal + 'px' if options.changeLineHeight

module.exports = textfill
