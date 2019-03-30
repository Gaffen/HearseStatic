const OptimizeJsPlugin = require("optimize-js-plugin");
const resolvers = require("./resolvers.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const url = require("url");

const path = require("path");
const webpack = require("webpack");

const assetsPath = path.resolve(__dirname, "..", "public", "assets");

function isProduction(env) {
  return env.NODE_ENV === "production";
}

function getPlugins(env) {
  let plugins = [new webpack.ProgressPlugin({ profile: false })];
  console.log(env);
  return [
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
    new CleanWebpackPlugin(),
    new OptimizeJsPlugin({
      sourceMap: !isProduction(env)
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new MiniCssExtractPlugin({
      filename: env == "development" ? "[name].css" : "[name]-[chunkhash].css",
      chunkFilename: "[id].css"
    }),
    new WebpackAssetsManifest({
      output: "../../data/manifest.json",
      transform: (assets, manifest) => {
        let vueComponents = {};
        Object.keys(manifest.compiler.records).forEach(e => {
          if (e.includes(".vue?")) {
            const compName = e
              .match(/\/(.*)\.vue/)[1]
              .split("/")
              .pop();
            vueComponents[compName] = url.parse(e.split(" ")[1], true).query.id;
          }
        });
        let output = {},
          re = /(?:\.([^.]+))?$/;
        output.vue = vueComponents;
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
    }),
    new VueLoaderPlugin()
  ];
}

module.exports = (config, env, target) => {
  if (!isProduction(env)) {
    config.devtool = "cheap-module-eval-source-map";
  } else {
    config.devtool = "eval-source-map";
  }
  config.resolve = resolvers;
  // if (!isProduction(env)) {
  //   config.devServer = {
  //     contentBase: "/assets/",
  //     hot: true
  //   };
  // }
  config.plugins = getPlugins(env);
  config.externals = {
    window: "window"
  };
  config.optimization = { minimize: !isProduction(env) };

  return config;
};
