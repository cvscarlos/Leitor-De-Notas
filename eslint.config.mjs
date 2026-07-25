// @ts-check
import js from '@eslint/js';
import angular from 'angular-eslint';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // index.html is a full HTML document, not an Angular template, so the template parser can't read it.
  { ignores: ['dist/**', 'out-tsc/**', '.angular/**', 'src/index.html'] },
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
    },
    plugins: { prettier },
    rules: {
      'max-len': ['error', { code: 100, tabWidth: 2, ignoreStrings: true }],
      semi: ['error', 'always'],
      'prettier/prettier': 'error',
      'no-extra-boolean-cast': 'off',
      // Every component here runs on eager change detection; moving to OnPush requires
      // auditing each one for mutations made outside Angular's event handlers.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error',
    },
  },
);
