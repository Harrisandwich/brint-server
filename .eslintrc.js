module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    rules: {
      'no-plusplus': 'off',
      'no-console': ['error', {'allow': ['warn', 'error']}],
      'newline-per-chained-call': 'off',
      'linebreak-style': ['error', 'unix'],
      semi: ['error', 'never'],
      'no-case-declarations': 0,
      'object-curly-newline': [
        'error',
        {
          ObjectExpression: { multiline: true },
          ObjectPattern: { multiline: true },
        },
      ],
      'no-mixed-operators': [
        'error',
        {
          groups: [
            ['+', '-', '*', '/', '%', '**'],
            ['&', '|', '^', '~', '<<', '>>', '>>>'],
            ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
            ['&&', '||'],
            ['in', 'instanceof'],
          ],
          allowSamePrecedence: true,
        },
      ],
      'no-restricted-syntax': 'off',
      'no-underscore-dangle': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: ['**/*.test.js', '**/*.spec.js', '**/setup-jest.js', 'webpack.**.config.js'] },
      ],
      'import/newline-after-import': ['error', { count: 2 }],
      'no-shadow': 'off',
      'max-len': [
        'error',
        { code: 100, tabWidth: 2, ignoreStrings: false, ignoreTemplateLiterals: false },
      ],
      'no-param-reassign': ['error', { props: false }],
      'import/prefer-default-export': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      camelcase: 'off',
    },
};
