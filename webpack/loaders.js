const autoprefixer = require("autoprefixer");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const production = JSON.stringify(process.env) === "production";

module.exports = function() {
  let cssLoaders = [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          importLoaders: 1,
        },
      },
    ],
    sassLoaders = [
      MiniCssExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          importLoaders: 1,
          sourceMap: !production,
          url: false,
        },
      },
      "postcss-loader",
      {
        loader: "sass-loader", // compiles Sass to CSS
        options: {
          sourceMap: !production,
        },
      },
    ];

  return [
    {
      test: /\.woff$|\.woff2?$|\.ttf$|\.eot$|\.otf$|\.svg$/,
      loader: "file-loader",
      options: {
        emitFile: false,
        name: "[name].[ext]",
        publicPath: "fonts",
      },
      exclude: /src\/svg/,
    },
    {
      test: /\.(png|jpg|gif)$/,
      loader: "file-loader",
      options: {},
    },
    {
      test: /\.js?$/,
      exclude: /(node_modules|bower_components)/,
      use: "babel-loader",
    },
    {
      test: /\.vue?$/,
      use: "vue-loader",
    },
    {
      test: /\.css$/,
      exclude: /node_modules/,
      use: cssLoaders,
    },
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: sassLoaders,
    },
    {
      test: /\.svg$/,
      use: [
        {
          loader: "raw-loader",
        },
      ],
    },
    {
      test: /\.modernizrrc$/,
      use: ["modernizr-loader", "json-loader"],
    },
  ];
};
