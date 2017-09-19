module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: 'expo',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['warn', 'single'],
    semi: ['error', 'never'],
    'no-unused-vars': 'off',
    'no-console': 'warn',
    'no-undef': 'warn',
    'prettier/prettier': [
      'warn',
      {
        printWidth: 100,
        tabWidth: 2,
        singleQuote: true,
        jsxBracketSameLine: true,
        trailingComma: 'none',
        semi: false
      }
    ]
  }
}
