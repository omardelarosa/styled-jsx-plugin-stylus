const expect = require('chai').expect;
const sinon = require('sinon');
const plugin = require('./')
const stripIndent = require('strip-indent');
const stylus = require('stylus');

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
      ]
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
      `
    );
    const outputCss = cleanup(
      `
      .my-class {
        color: #f00;
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
        render = sinon.spy((s) => outputCss);
        importer = sinon.spy((s) => s);
        beforeRender.reset();
        opts = {
          beforeRender
        };
        mockStylus = (css) => {
          return {
            render,
            'import': importer
          }
        };
        stylusRenderer = mockStylus(inputStylus);
        preprocessedCss = plugin(inputStylus, opts, mockStylus);
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

      it('calls render function without any arguments', () => {
        expect(render.args[0].length).to.eq(0);
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
          beforeRender: null
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
        expect(render.calledWith(inputStylus)).to.eq(true);
      });
    });
  });
})
