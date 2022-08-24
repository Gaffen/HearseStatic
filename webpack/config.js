const AssetsPlugin = require('assets-webpack-plugin');
const path = require('path');
const envSettings = require('./environment.config.js');

const getLoaders = require('./loaders.js');
const webpack = require('webpack');

const assetsPath = path.resolve(__dirname, '..', 'build', 'assets');

module.exports = (env) => {
  const prod = env === 'production';
  let config = {
    context: path.resolve(__dirname, '..'),
    entry: {
      main: ['./src/js/main.js', './src/scss/styles.scss'],
    },
    mode: prod ? 'production' : 'development',
    output: {
      path: assetsPath,
      filename: prod ? '[name]-[fullhash].js' : '[name].js',
      chunkFilename: prod ? '[name]-[chunkhash].js' : '[name].js',
      publicPath: '/assets/',
    },
    module: {
      rules: getLoaders(),
    },
    resolve: {
      extensions: ['.mjs', '.js', '.svelte', '.svlt', '.vue', '.scss'],
      alias: {
        styles: path.resolve(__dirname, '..', 'src', 'scss'),
      },
    },
  };

  return envSettings(config, env);
};
