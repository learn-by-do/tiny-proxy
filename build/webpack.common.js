const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const root = path.resolve(process.cwd(), './');
module.exports = {
  entry: {
    popup: path.join(root, 'src/popup/index.tsx'),
    background: path.join(root, 'src/background.ts')
  },
  output: {
    path: path.resolve(root, 'dist'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
        exclude: /node_modules/,
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader' // Creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // Translates CSS into CommonJS
          },
          {
            loader: 'sass-loader' // Compiles Sass to CSS
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      chunks: ['popup'],
      template: 'src/popup/index.html',
      filename: 'popup.html'
    }),
    new CopyPlugin(['config', 'assets'])
  ]
};
