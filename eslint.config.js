import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      'options/jml.js',
      'polyfills/browser-polyfill.min.js'
    ]
  },
  {
    languageOptions: {
      globals: {
        browser: 'readonly'
      }
    }
  },
  ...ashNazg(['sauron', 'browser'])
];
