import importPlugin from 'eslint-plugin-import-x';
import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/playwright-report/**',
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/docs/components/**',
      '**/docs/api/**',
      '**/dist',
      '**/out-tsc',
      '**/vite.config.*',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      '**/node_modules',
      'docs/.vuepress/.cache',
      'docs/.vuepress/.temp',
      '**/test-results/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  importPlugin.flatConfigs.recommended,
  {
    files: ['**/*.{js,vue,ts,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      quotes: ['error', 'single'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'import-x/default': 'off',
      'import-x/named': 'off',
      'import-x/no-unresolved': 'off',
      'import-x/newline-after-import': ['error', { count: 1 }],
      // Same import order as crouton.
      'import-x/order': [
        'error',
        {
          named: true,
          alphabetize: {
            order: 'asc',
          },
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@ghentcdh/**',
              group: 'external',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          groups: ['external', 'internal', 'index', 'object'],
        },
      ],
    },
  },
];
