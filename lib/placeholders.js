const add = (css) => {
  return css
    .replace(/\:\s*%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `: \$styled-jsx-placeholder-${id}()`
    )
    .replace(/%%styled-jsx-placeholder-(\d+)%%/g, (_, id) =>
      `/*%%styled-jsx-placeholder-${id}%%*/`
    );
};

const remove = (css) => {
  return css
    .replace(/\:\s*\$styled-jsx-placeholder-(\d+)\(\)/g, (_, id) =>
      `: %%styled-jsx-placeholder-${id}%%`
    )
    .replace(/\/\*%%styled-jsx-placeholder-(\d+)%%\*\//g, (_, id) =>
      `%%styled-jsx-placeholder-${id}%%`
    )
};

module.exports = {
  add,
  remove
}
