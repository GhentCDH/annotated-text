import baseConfig from '../../eslint.config.js';

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {},
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    files: ['**/e2e/**/*.spec.ts', '**/e2e/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
];
