const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    index: './js/index.js',
    wiki: './app/wiki.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: 'app/[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      // inject: false,
      chunks: ['index'],
      template: 'app/index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      // inject: false,
      chunks: ['wiki'],
      template: 'app/wiki.html',
      filename: 'app/wiki.html',
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
        test: /\._js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
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
