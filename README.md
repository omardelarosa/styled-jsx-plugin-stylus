# styled-jsx-plugin-stylus

[![Build Status](https://travis-ci.org/omardelarosa/styled-jsx-plugin-stylus.svg?branch=master)](https://travis-ci.org/omardelarosa/styled-jsx-plugin-stylus)
[![npm](https://img.shields.io/npm/v/styled-jsx-plugin-stylus.svg)](https://www.npmjs.com/package/styled-jsx-plugin-stylus)

Use [Stylus](http://stylus-lang.com/) with [styled-jsx](https://github.com/zeit/styled-jsx) 💥

## Usage

Install the package first.

```bash
npm install --save-dev styled-jsx-plugin-stylus
```

Install the `stylus` version you need (it is a peer dependency).

```bash
npm install --save-dev stylus
```

Next, add `styled-jsx-plugin-stylus` to the `styled-jsx`'s `plugins` in your babel configuration:

```json
{
  "plugins": [
    [
      "styled-jsx/babel",
      { "plugins": ["styled-jsx-plugin-stylus"] }
    ]
  ]
}
```

## Stylus options

Node-sass can be configured using `sassOptions`. This is useful for setting options such as `includePaths` or `precision`.

```json
{
  "plugins": [
    [
      "styled-jsx/babel",
      {
        "plugins": [
          ["styled-jsx-plugin-sass", {
              "sassOptions": {
                "includePaths": ["./styles"],
                "precision": 2
              }
            }
          ]
        ]
      }
    ]
  ]
}
```

#### Notes

`styled-jsx-plugin-stylus` uses `styled-jsx`'s plugin system which is supported from version 2.

Read more on their repository for further info.

## License

MIT
