const path = require('path');

module.exports = {
  modules: [
    path.join(__dirname, '../node_modules'),
    path.join(__dirname, '../src'),
  ],
  extensions: ['.json', '.js', '.mjs', '.svelte', '.svlt'],
  mainFields: ['svelte', 'browser', 'module', 'main'],
  alias: {
    modernizr$: path.resolve(__dirname, '../.modernizrrc'),
    styles: path.resolve(__dirname, '..', 'src', 'scss'),
    svelte: path.resolve('node_modules', 'svelte'),
  },
};
