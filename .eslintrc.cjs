/* Copyright 2013 - 2022 Waiterio LLC */
/* istanbul ignore file */
/* eslint-disable quote-props */

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb'],
  plugins: ['import'],
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.js', '.json'],
      },
    },
  },
  rules: {
    'import/extensions': ['error', 'always'],
  },
},
