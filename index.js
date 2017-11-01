module.exports = (css, settings, stylus = require('stylus')) => {
  const cssWithPlaceholders = css
    .replace(/\:\s*$styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `: \$styled-jsx-placeholder-${id}()`
    )
    .replace(/%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `/*%%styled-jsx-placeholder-${id}%%*/`
    )

  const preprocessed = stylus.render(cssWithPlaceholders.toString(), settings);

  return preprocessed
    .replace(/\:\s*\$styled-jsx-placeholder-(\d+)\(\)/g, (_, id) =>
      `: %%styled-jsx-placeholder-${id}%%`
    )
    .replace(/\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-placeholder-${id}%%`
    )
}
