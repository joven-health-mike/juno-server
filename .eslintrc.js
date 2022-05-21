module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'lines-between-class-members': [
      'error', 
      'always'
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'max-lines': [
      'error', 
      750
    ],
    'no-console': [
      'error'
    ],
    'no-nested-ternary': [
      'error'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ]
  }
}
