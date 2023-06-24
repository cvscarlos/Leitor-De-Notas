{
  "root": true,
  "ignorePatterns": [
    "projects/**/*"
  ],
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "parserOptions": {
        "project": [
          "tsconfig.eslint.json"
        ],
        "createDefaultProgram": true
      },
      "extends": [
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
        "plugin:import/recommended",
        "airbnb-typescript/base"
      ],
      "rules": {
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "app",
            "style": "kebab-case"
          }
        ],
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "app",
            "style": "camelCase"
          }
        ],
        "@typescript-eslint/lines-between-class-members": [
          "error",
          "always",
          {
            "exceptAfterSingleLine": true
          }
        ],
        "import/named": "off",
        "import/no-named-as-default-member": "off",
        "import/no-unresolved": "off",
        "indent": [
          "error",
          2
        ],
        "max-len": "off",
        "no-trailing-spaces": "error",
        "no-underscore-dangle": "off",
        "prefer-template": "error",
        "quotes": [
          "error",
          "single"
        ],
        "sort-imports": [
          "error",
          {
            "ignoreCase": true,
            "ignoreDeclarationSort": false,
            "ignoreMemberSort": false,
            "memberSyntaxSortOrder": [
              "none",
              "all",
              "multiple",
              "single"
            ],
            "allowSeparatedGroups": true
          }
        ]
      }
    },
    {
      "files": [
        "*.html"
      ],
      "plugins": [
        "eslint-plugin-html"
      ],
      "extends": [
        "plugin:@angular-eslint/template/recommended"
      ],
      "rules": {
        "indent": [
          "error",
          2
        ],
        "max-len": "off",
        "no-trailing-spaces": "error",
        "quotes": [
          "error",
          "single"
        ]
      }
    }
  ]
}
