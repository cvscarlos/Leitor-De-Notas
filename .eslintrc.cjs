module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*'],
  plugins: ['prettier', '@typescript-eslint', '@angular-eslint'],
  rules: {
    'max-len': ['error', { code: 100, tabWidth: 2, ignoreStrings: true }],
    semi: ['error', 'always'],
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['*.{js, cjs}'],
      extends: ['eslint:recommended'],
    },
    {
      files: ['*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          { type: 'attribute', prefix: 'app', style: 'camelCase' },
        ],
        '@angular-eslint/component-selector': [
          'error',
          { type: 'element', prefix: 'app', style: 'kebab-case' },
        ],
        'no-extra-boolean-cast': 'off',
      },
    },
    {
      files: ['*.html'],
      extends: [
        'plugin:@angular-eslint/template/recommended',
        'plugin:@angular-eslint/template/accessibility',
      ],
      rules: {
        'max-len': 'off',
      },
    },
  ],
};
