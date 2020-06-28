const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      // inject: false,
      chunks: ['index'],
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
  ],
  externals: [
    {
      jquery: 'jQuery',
      ncmb: 'NCMB',
    },
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    ie: '11',
                  },
                  useBuiltIns: 'usage',
                  corejs: 3, // or 2
                },
              ],
            ],
          },
        },
      },
      {
        // npm install json-loader --save-dev
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
};
