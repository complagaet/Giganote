const js = require('@eslint/js');

module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            indent: ['error', 4],
            'no-undef': 'off',
            'no-useless-escape': 'off',
            'no-dupe-class-members': 'off',
            'no-unused-vars': ['warn'],
        },
    },
];
