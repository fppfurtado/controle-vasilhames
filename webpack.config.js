const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'js/index.js',
    path: path.resolve(__dirname, 'public'),
    clean: true
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'src/index.html'
  })]
};