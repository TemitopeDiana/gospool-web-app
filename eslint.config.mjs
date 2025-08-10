import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'next',
      'next/core-web-vitals',
      'prettier',
    ],
    plugins: ['@typescript-eslint'],
    rules: {
      'space-before-function-paren': 'off',
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
        },
      ],
      'react/no-unescaped-entities': 'off',
      '@next/next/no-document-import-in-page': 'off',
      'react/display-name': 'off',
    },
  }),
  { ignores: ['.next/', 'node_modules/'] },
];

export default eslintConfig;
