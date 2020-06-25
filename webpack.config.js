const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    index: './js/index.js',
    wiki: './app/wiki.js',
    edit: './app/edit.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: 'app/[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      // inject: false,
      chunks: ['index'],
      template: 'index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      // inject: false,
      chunks: ['wiki'],
      template: 'app/wiki.html',
      filename: 'app/wiki.html',
    }),
    new HtmlWebpackPlugin({
      // inject: false,
      chunks: ['edit'],
      template: 'app/edit.html',
      filename: 'app/edit.html',
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
