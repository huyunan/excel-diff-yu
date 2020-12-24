module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'comma-dangle': ['error', 'never'],
    curly: ['error', 'all'],
    'eol-last': ['error'],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1
      }
    ],
    'keyword-spacing': ['error'],
    'max-len': [
      'error',
      {
        code: 180,
        ignoreComments: true,
        ignoreRegExpLiterals: true
      }
    ],
    'no-else-return': ['error'],
    'no-mixed-spaces-and-tabs': ['error'],
    'no-multiple-empty-lines': ['error'],
    'no-spaced-func': ['error'],
    'no-trailing-spaces': ['error'],
    'no-unexpected-multiline': ['error'],
    'no-unused-vars': [
      'error',
      {
        args: 'none',
        vars: 'all'
      }
    ],
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
        avoidEscape: true
      }
    ],
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'space-in-parens': ['error', 'never'],
    'space-unary-ops': [
      'error',
      {
        nonwords: false,
        overrides: {}
      }
    ],
    'arrow-body-style': [
      'error',
      'as-needed',
      {
        requireReturnForObjectLiteral: false
      }
    ],
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': [
      'error',
      {
        after: true,
        before: true
      }
    ],
    'no-class-assign': ['error'],
    'no-const-assign': ['error'],
    'no-dupe-class-members': ['error'],
    'no-duplicate-imports': ['error'],
    'no-new-symbol': ['error'],
    'no-useless-rename': ['error'],
    'no-var': ['error'],
    'object-shorthand': [
      'error',
      'always',
      {
        avoidQuotes: true,
        ignoreConstructors: false
      }
    ],
    'prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: false,
        allowUnboundThis: true
      }
    ],
    'prefer-const': ['error'],
    'prefer-rest-params': ['error'],
    'prefer-template': ['error'],
    'template-curly-spacing': ['error', 'never']
  }
}
