const { FlatCompat } = require('@eslint/eslintrc');
const typeScriptEsLintPlugin = require('@typescript-eslint/eslint-plugin');
const esLintConfigPrettier = require('eslint-config-prettier');

// Translate ESLintRC-style configs into flat configs.
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: typeScriptEsLintPlugin.configs['recommended'],
});

module.exports = {
    ...compat.config({
        parserOptions: {
            project: ['./tsconfig.json'],
            sourceType: 'module',
        },
        env: {
            browser: true,
            es2021: true,
        },
        extends: [
            // 'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:@angular-eslint/recommended',
            'prettier',
        ],
        plugins: [
            '@typescript-eslint',
            '@angular-eslint',
            'prettier',
        ],
        rules: {
            'prettier/prettier': ['error'],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'warn',
        },
    }),
    esLintConfigPrettier,
};
