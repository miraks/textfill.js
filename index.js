var defaultOptions, textfill, _;

_ = require('lodash');

defaultOptions = {
  maxFontPixels: 40,
  minFontPixels: 4,
  widthOnly: false,
  explicitWidth: null,
  explicitHeight: null,
  changeLineHeight: false
};

textfill = function(el, options) {
  var fontSizeFinal, fontSizeHeight, fontSizeWidth, lineHeight, maxHeight, maxWidth, newSizing, style, text;
  options = _.defaults({}, options, defaultOptions);
  text = el.children[0];
  maxHeight = options.explicitHeight || el.clientHeight;
  maxWidth = options.explicitWidth || el.clientWidth;
  style = getComputedStyle(text);
  lineHeight = parseFloat(style.lineHeight) / parseFloat(style.fontSize);
  newSizing = function(prop, max) {
    var fontSize, maxFontPixels, minFontPixels;
    minFontPixels = options.minFontPixels, maxFontPixels = options.maxFontPixels;
    while (minFontPixels < maxFontPixels - 1) {
      fontSize = Math.floor((minFontPixels + maxFontPixels) / 2);
      text.style.fontSize = fontSize + 'px';
      if (text[prop] <= max) {
        minFontPixels = fontSize;
        if (text[prop] === max) {
          break;
        }
      } else {
        maxFontPixels = fontSize;
      }
    }
    if (text[prop] <= max) {
      minFontPixels = maxFontPixels;
    }
    return minFontPixels;
  };
  if (!options.widthOnly) {
    fontSizeHeight = newSizing('offsetHeight', maxHeight);
  }
  fontSizeWidth = newSizing('offsetWidth', maxWidth);
  fontSizeFinal = options.widthOnly ? fontSizeWidth : Math.min(fontSizeHeight, fontSizeWidth);
  text.style.fontSize = fontSizeFinal + 'px';
  if (options.changeLineHeight) {
    return el.style.lineHeight = lineHeight * fontSizeFinal + 'px';
  }
};

module.exports = textfill;
