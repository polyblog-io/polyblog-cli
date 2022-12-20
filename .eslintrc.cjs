/* Copyright 2013 - 2022 Waiterio LLC */
/* istanbul ignore file */
/* eslint-disable quote-props */

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
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
    semi: ['error', 'never'],
    'import/extensions': ['error', 'always'],
    'no-console': 'off',
    'prefer-const': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-await-in-loop': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
  },
}
