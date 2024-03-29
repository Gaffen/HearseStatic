const resolvers = require('./resolvers.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const url = require('url');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const webpack = require('webpack');

function isProduction(env) {
  return env.production;
}

function getPlugins(env, local) {
  let plugins = [
    new webpack.ProgressPlugin({ profile: false }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          [
            'imagemin-svgo',
            {
              plugins: [
                // SVGO options is here "https://github.com/svg/svgo#what-it-can-do"
                {
                  removeAttrs: ['fill', 'stroke'],
                },
              ],
            },
          ],
        ],
      },
    }),
  ];
  const pluginList = [
    new webpack.IgnorePlugin({
      resourceRegExp: /\.\/dev/,
      contextRegExp: /\/config$/,
    }),
    new MiniCssExtractPlugin({
      filename: !env.production ? '[name].css' : '[name]-[chunkhash].css',
      chunkFilename: '[id].css',
    }),
    new WebpackAssetsManifest({
      output: '../../data/manifest.json',
      transform: (assets, manifest) => {
        let vueComponents = {};
        Object.keys(manifest.compiler.records).forEach((e) => {
          if (e.includes('.vue?')) {
            const compName = e
              .match(/\/(.*)\.vue/)[1]
              .split('/')
              .pop();
            vueComponents[compName] = url.parse(e.split(' ')[1], true).query.id;
          }
        });
        let output = {},
          re = /(?:\.([^.]+))?$/;
        output.vue = vueComponents;
        Object.keys(assets).forEach((assetName) => {
          const batchName = assetName.replace(/\.[^/.]+$/, ''),
            outputName = assets[assetName];
          if (typeof output[batchName] == 'undefined') {
            output[batchName] = {};
          }
          if (outputName.endsWith('.js')) {
            output[batchName].js = outputName;
          } else if (outputName.endsWith('.css')) {
            output[batchName].css = outputName;
          }
        });
        return output;
      },
    }),
    new VueLoaderPlugin(),
  ];
  if (!local) {
    pluginList.push(new CleanWebpackPlugin());
  }
  return pluginList;
}

module.exports = (config, env, target) => {
  if (!isProduction(env)) {
    config.devtool = 'eval-source-map';
  } else {
    config.devtool = false;
  }
  config.resolve = resolvers;
  // if (!isProduction(env)) {
  //   config.devServer = {
  //     contentBase: "/assets/",
  //     hot: true
  //   };
  // }
  config.plugins = getPlugins(env, target === 'tag');
  config.externals = {
    window: 'window',
  };
  config.optimization = {
    minimize: isProduction(env),
    minimizer: [new TerserPlugin()],
  };

  return config;
};
