const autoprefixer = require('autoprefixer');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { alias_webpack_importer } = require('./svelteAlias');

const production = JSON.stringify(process.env) === 'production';

module.exports = function (inline) {
  let cssLoaders = [MiniCssExtractPlugin.loader, 'css-loader'],
    sassLoaders = [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          sourceMap: !production,
          url: false,
        },
      },
      'postcss-loader',
      {
        loader: 'sass-loader', // compiles Sass to CSS
        options: {
          sourceMap: !production,
        },
      },
    ];

  return [
    {
      test: /\.woff$|\.woff2?$|\.ttf$|\.eot$|\.otf$|\.svg$/,
      loader: 'file-loader',
      options: {
        emitFile: false,
        name: '[name].[ext]',
        publicPath: 'fonts',
      },
      exclude: /src\/svg/,
    },
    {
      test: /\.(png|jpg|gif)$/,
      loader: 'file-loader',
      options: {},
    },
    {
      test: /\.js?$/,
      exclude: /(node_modules|bower_components)/,
      use: 'babel-loader',
    },
    {
      test: /\.vue?$/,
      use: 'vue-loader',
    },
    {
      test: /\.svelte?$/,
      use: {
        loader: 'svelte-loader',
        options: {
          preprocess: require('svelte-preprocess')({
            sourceMap: !production,
            postcss: {
              plugins: [require('autoprefixer')()],
            },
            scss: {
              importer: [alias_webpack_importer()],
            },
          }),
          emitCss: !inline,
          compilerOptions: {
            hydratable: true,
            generate: inline ? 'ssr' : 'dom',
            dev: !production,
            format: inline ? 'cjs' : 'esm',
          },
        },
      },
    },
    // {
    //   // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
    //   test: /node_modules\/svelte\/.*\.mjs$/,
    //   resolve: {
    //     fullySpecified: false,
    //   },
    // },
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
          loader: 'raw-loader',
        },
      ],
    },
    {
      test: /\.modernizrrc$/,
      use: ['modernizr-loader', 'json-loader'],
    },
  ];
};
