const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    index: './src/index.js',
    login: './src/login.js',
    logout: './src/logout.js',
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
    new HtmlWebpackPlugin({
      // inject: false,
      chunks: ['login'],
      template: path.resolve(__dirname, './src/login.html'),
      filename: 'login.html',
    }),
    new HtmlWebpackPlugin({
      // inject: false,
      chunks: ['logout'],
      template: path.resolve(__dirname, './src/logout.html'),
      filename: 'logout.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'app/*.html', to: '', context: 'src/' },
        { from: 'app/*.css', to: '', context: 'src/' },
        { from: 'lib/*.js', to: '', context: 'src/' },
        { from: 'styles/*', to: '', context: 'src/' },
        { from: 'img/*', to: '', context: '' },
        { from: 'text/*', to: '', context: '' },
      ],
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
