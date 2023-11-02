module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*'],
  rules: {
    'max-len': ['error', { code: 100, tabWidth: 2, ignoreStrings: true }],
    'semi': ['error', 'always'],
  },
  overrides: [
    {
      files: ['*.{js, cjs}'],
      extends: [
        'eslint:recommended',
        'airbnb-base'
      ]
    },
    {
      files: ['*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@angular-eslint/recommended',
        // This is required if you use inline templates in Components
        'plugin:@angular-eslint/template/process-inline-templates'
      ],
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          { type: 'attribute', prefix: 'app', style: 'camelCase' }
        ],
        '@angular-eslint/component-selector': [
          'error',
          { type: 'element', prefix: 'app', style: 'kebab-case' }
        ],
        'no-extra-boolean-cast': 'off',
      }
    },
    {
      files: ['*.html'],
      extends: [
        'plugin:@angular-eslint/template/recommended',
        'plugin:@angular-eslint/template/accessibility'
      ],
      rules: {
        'max-len': 'off'
      }
    }
  ]
};
