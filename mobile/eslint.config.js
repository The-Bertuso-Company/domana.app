/** ESLint v9 flat config for Expo + TypeScript + Prettier (mobile) */
const { FlatCompat } = require('@eslint/eslintrc');
const tsParser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  // Bring in Expo's legacy config (compat → flat)
  ...compat.extends('eslint-config-expo'),

  // Project sources (exclude config files)
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: [
      '**/*.config.*',
      'eslint.config.*',
      'prettier.config.*',
      'metro.config.*',
      'babel.config.*',
    ],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // Lint config files with Node globals and CommonJS, but relax no-undef (for __dirname/require)
  {
    files: [
      '**/*.config.*',
      'eslint.config.*',
      'prettier.config.*',
      'metro.config.*',
      'babel.config.*',
    ],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },

  // Global ignores
  { ignores: ['node_modules/**', 'android/**', 'ios/**', '.expo/**'] },
];
