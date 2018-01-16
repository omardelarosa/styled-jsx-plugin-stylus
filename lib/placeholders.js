const add = css => css.replace(/%%(styled-jsx-placeholder-\d+)%%/g, '_$1_');

const remove = css => css.replace(/_(styled-jsx-placeholder-\d+)_/g, '%%$1%%');

module.exports = {
  add,
  remove
}
