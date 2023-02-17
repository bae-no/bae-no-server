module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'eslint-plugin-node'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    "plugin:jest-formatting/recommended",
    'eslint-config-async',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    "@typescript-eslint/member-ordering": ["error"],
    '@typescript-eslint/consistent-type-imports': 'error',
    'curly': 1,
    'no-console': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'eqeqeq': ['error', 'always'],
    'no-else-return': ['error', { allowElseIf: false }],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'block' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      },
    ],
    'import/newline-after-import': ['error', { 'count': 1 }],
    'max-nested-callbacks': ["error", 5],
  },
};
