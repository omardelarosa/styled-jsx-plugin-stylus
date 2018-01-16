const expect = require('chai').expect;
const sinon = require('sinon');
const plugin = require('./')
const stripIndent = require('strip-indent');
const stylus = require('stylus');
const placeholders = require('./lib/placeholders');

const cleanup = str => stripIndent(str).trim()

describe('styled-jsx-plugin-stylus', () => {
  describe('basic props', () => {

    const cases = [
      [
        'color properties',
        `
          .red
            color red
        `,
        `
          .red {
            color: #f00;
          }
        `
      ],
      [
        'nested selectors',
        `
          .outer-class
            .inner-class
              color green
              display none
        `,
        `
        .outer-class .inner-class {
          color: #008000;
          display: none;
        }
        `
      ],
      [
        'ampersand & operator',
        `
          .first
            &-second
              color green
              display none
        `,
        `
        .first-second {
          color: #008000;
          display: none;
        }
        `
      ],
      [
        'dynamic variables in selectors',
        `
          %%styled-jsx-placeholder-0%%
          %%styled-jsx-placeholder-1%%
            background red
        `,
        `
          %%styled-jsx-placeholder-0%%,
          %%styled-jsx-placeholder-1%% {
            background: #f00;
          }
        `
      ],
      [
        'dynamic variables in pseudo selectors',
        `
          h1
            &:nth-child(%%styled-jsx-placeholder-0%%)
              background red
        `,
        `
          h1:nth-child(%%styled-jsx-placeholder-0%%) {
            background: #f00;
          }
        `
      ],
      [
        'dynamic variables in values interpolation',
        `
          h1
            background red
            padding %%styled-jsx-placeholder-0%% %%styled-jsx-placeholder-1%%px
            margin-top %%styled-jsx-placeholder-2%%px
        `,
        `
          h1 {
            background: #f00;
            padding: %%styled-jsx-placeholder-0%% %%styled-jsx-placeholder-1%%px;
            margin-top: %%styled-jsx-placeholder-2%%px;
          }
        `
      ],
    ];

    cases.forEach(([description, stylus, css]) => {
      it(description, () => {
        expect(
          cleanup(plugin(stylus))
        ).to.eq(
          cleanup(css)
        );
      });
    });
  });

  describe('with settings', () => {
    const inputStylus = cleanup(
      `
      .my-class
        color red
        background-color %%styled-jsx-placeholder-0%%
      `
    );
    const outputCss = cleanup(
      `
      .my-class {
        color: #f00;
        background-color: %%styled-jsx-placeholder-0%%;
      }
      `
    );
    let beforeRender = sinon.spy((stylus, css) => {
      stylus.import('fixture.css');
      return stylus;
    });
    let render;
    let importer;
    let mockStylus = {};
    let stylusRenderer;
    let opts = {};
    let preprocessedCss;

    describe('when beforeRender function is provided', () => {
      beforeEach(() => {
        render = sinon.spy((s, opts) => {
          opts.use(mockStylus());
          return outputCss;
        });
        importer = sinon.spy((s) => s);
        beforeRender.reset();
        opts = {
          use: beforeRender
        };
        mockStylus = (css) => {
          return {
            render,
            'import': importer
          }
        };
        preprocessedCss = plugin(inputStylus, opts, mockStylus());
      });

      it('returns the correct preprocessed css string', () => {
        expect(preprocessedCss.trim()).to.eq(outputCss.trim());
      });

      it('calls beforeRender function once', () => {
        expect(beforeRender.calledOnce).to.eq(true);
      });

      it('calls render function once', () => {
        expect(render.calledOnce).to.eq(true);
      });

      it('calls import function once', () => {
        expect(importer.calledOnce).to.eq(true);
      });

      it('calls render function with two arguments', () => {
        expect(render.args[0].length).to.eq(2);
      });
    });

    describe('when beforeRender function is not provided', () => {
      beforeEach(() => {
        render = sinon.spy((s) => outputCss);
        importer = sinon.spy((s) => s);
        beforeRender.reset();
        mockStylus = (css) => {
          return {
            render,
            'import': importer
          }
        };
        opts = {
          use: null
        };
        preprocessedCss = plugin(inputStylus, opts, mockStylus());
      });

      it('returns the correct preprocessed css string', () => {
        expect(preprocessedCss.trim()).to.eq(outputCss.trim());
      });

      it('calls beforeRender function once', () => {
        expect(beforeRender.calledOnce).to.eq(false);
      });

      it('calls beforeRender with a stylus object', () => {
        expect(beforeRender.calledWith(stylus)).to.eq(false);
      });

      it('calls render function once', () => {
        expect(render.calledOnce).to.eq(true);
      });

      it('calls render function with input css', () => {
        expect(
          render.calledWith(placeholders.add(inputStylus))
        ).to.eq(true);
      });
    });
  });
})
