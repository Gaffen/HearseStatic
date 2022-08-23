const path = require('path');
const envSettings = require('./environment.config.js');

const getLoaders = require('./loaders.js');
const webpack = require('webpack');

const assetsPath = path.resolve(__dirname, '..', 'build', 'assets');

module.exports = (file) => {
  let config = {
    context: path.resolve(__dirname, '..'),
    entry: {
      main: [file],
    },
    mode: 'production',
    output: {
      path: '/',
      filename: 'bundle.js',
      libraryTarget: 'commonjs',
    },
    module: {
      rules: getLoaders(true),
    },
    resolve: {
      extensions: ['.mjs', '.js', '.svelte', '.svlt', '.scss'],
      alias: {
        styles: path.resolve(__dirname, '..', 'src', 'scss'),
      },
    },
  };
  return envSettings(config, { production: true }, 'tag');
};
