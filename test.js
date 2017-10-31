const expect = require('chai').expect;
const plugin = require('./')
const stripIndent = require('strip-indent');

const cleanup = str => stripIndent(str).trim()

describe('styled-jsx-plugin-stylus', () => {
  it('converts colors', () => {
    expect(
      cleanup(plugin(
        `
          .red
            color red
        `
      ))
    ).to.eq(
      cleanup(`
        .red {
          color: #f00;
        }
      `)
    );
  });
})
