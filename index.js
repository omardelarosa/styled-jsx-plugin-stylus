const stylus = require('stylus')

module.exports = (css, settings) => {
  if (!settings) settings = {};
  const cssWithPlaceholders = css
    .replace(/\:\s*%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `: styled-jsx-placeholder-${id}()`
    )
    .replace(/%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `/*%%styled-jsx-placeholder-${id}%%*/`
    )

  const beforeRender = settings.beforeRender;
  let preprocessed;
  if (typeof beforeRender === 'function') {
    preprocessed = beforeRender(stylus, css).render(css.toString());
  } else {
    preprocessed = stylus.render(css.toString());
  }

  return preprocessed
    .replace(/\:\s*styled-jsx-placeholder-(\d+)\(\)/g, (_, id) =>
      `: %%styled-jsx-placeholder-${id}%%`
    )
    .replace(/\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-placeholder-${id}%%`
    )
}
