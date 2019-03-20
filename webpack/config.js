const AssetsPlugin = require("assets-webpack-plugin");
const path = require("path");
const envSettings = require("./environment.config.js");

const getLoaders = require("./loaders.js");
const webpack = require("webpack");

const assetsPath = path.resolve(__dirname, "..", "assets");

module.exports = env => {
  let config = {
    context: path.resolve(__dirname, ".."),
    entry: {
      main: ["./src/js/main.js", "./src/scss/styles.scss"]
    },
    mode: env,
    output: {
      path: assetsPath,
      filename: "[name]-[hash].js",
      chunkFilename: "[name]-[chunkhash].js",
      publicPath: "/"
    },
    module: {
      rules: getLoaders()
    }
  };

  return envSettings(config, env);
};
