import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import playwright from 'eslint-plugin-playwright'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.playwright/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/coverage/**',
      '**/blob-report/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      ...prettierConfig.rules,
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
        },
      ],
    },
  },
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ...cfg.languageOptions,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
      },
    },
  })),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      ...prettierConfig.rules,

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
        },
      ],
    },
  },
  {
    files: ['tests/**/*.{ts,tsx}'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-networkidle': 'error',
      'playwright/no-conditional-in-test': 'off',
      'playwright/no-conditional-expect': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/require-await': 'off',
      'no-restricted-syntax': [
        'error',
        // locator('.class')
        {
          selector: "CallExpression[callee.property.name='locator'] Literal[value=/^\\./]",
          message: 'Do not use CSS class selectors. Use getByTestId() or getByRole().',
        },
        // locator('div > span')
        {
          selector:
            "CallExpression[callee.property.name='locator'] Literal[value=/^(div|span|button|input)/]",
          message: 'Do not use structural CSS selectors. Use semantic locators.',
        },
        // locator('//xpath')
        {
          selector: "CallExpression[callee.property.name='locator'] Literal[value=/^\\/\\//]",
          message: 'XPath selectors are forbidden. Use getByTestId() or getByRole().',
        },
      ],
    },
  },
  {
    files: ['tests/fixtures/expect.ts'],
    rules: {
      '@typescript-eslint/no-namespace': 'off',
    },
  },
]
