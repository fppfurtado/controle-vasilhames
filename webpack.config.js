const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'public'),
    clean: true
  },
  module: {
    rules: [
      { 
        test: /\.css$/, 
        use: [MiniCssExtractPlugin.loader, 'css-loader'] 
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerWebpackPlugin(),
      '...'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
};