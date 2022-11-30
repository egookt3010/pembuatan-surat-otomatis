const webpack = require('webpack');
const path = require('path');
// const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    content: './src/app.js',
    update: './src/appUpdate.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../js/making/'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Popper: ['popper.js', 'default'],
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
