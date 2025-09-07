module.exports = {
  extends: ['./base.js'],
  overrides: [
    {
      files: ['**/*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      },
      plugins: ['svelte'],
      rules: {
        'svelte/no-at-html-tags': 'error',
        'svelte/no-target-blank': 'error',
        'svelte/valid-compile': 'error'
      }
    }
  ]
};
