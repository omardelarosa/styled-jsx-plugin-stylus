const placeholders = require('./lib/placeholders');

module.exports = (css, settings, stylus = require('stylus')) => {
  const cssWithPlaceholders = placeholders.add(css);

  const preprocessed = stylus.render(cssWithPlaceholders.toString(), settings);

  return placeholders.remove(preprocessed);
}
