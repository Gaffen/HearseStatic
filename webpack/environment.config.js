const OptimizeJsPlugin = require("optimize-js-plugin");
const resolvers = require("./resolvers.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const path = require("path");
const webpack = require("webpack");

const assetsPath = path.resolve(__dirname, "..", "public", "assets");

function isProduction(env) {
  return env.NODE_ENV === "production";
}

function getPlugins(env) {
  let plugins = [new webpack.ProgressPlugin({ profile: false })];
  return [
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
    new CleanWebpackPlugin(),
    new OptimizeJsPlugin({
      sourceMap: !isProduction(env)
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name]-[chunkhash].css",
      chunkFilename: "[id].css"
    }),
    new WebpackAssetsManifest({
      output: "../assets/manifest.json",
      transform: (assets, manifest) => {
        let output = {},
          re = /(?:\.([^.]+))?$/;
        Object.keys(assets).forEach(assetName => {
          const batchName = assetName.replace(/\.[^/.]+$/, ""),
            outputName = assets[assetName];

          if (typeof output[batchName] == "undefined") {
            output[batchName] = {};
          }

          if (outputName.endsWith(".js")) {
            output[batchName].js = outputName;
          } else if (outputName.endsWith(".css")) {
            output[batchName].css = outputName;
          }
        });
        return output;
      }
    })
  ];
}

module.exports = (config, env, target) => {
  if (!isProduction(env)) {
    config.devtool = "cheap-module-source-map";
  } else {
    config.devtool = "source-map";
  }
  config.resolve = resolvers;
  if (!isProduction(env)) {
    config.devServer = {
      contentBase: "./public/",
      hot: true
    };
  }
  config.plugins = getPlugins(env);
  config.externals = {
    window: "window"
  };
  config.optimization = { minimize: !isProduction(env) };

  return config;
};
