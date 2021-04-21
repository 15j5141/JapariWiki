const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const fs = require('fs');
// .env環境変数を読み込む.
require('dotenv').config();
// JW独自の設定を読み込む.
const env = Object.keys(process.env)
  .filter(key => key.startsWith('JW_')) // prefix JW_ を抽出する.
  .reduce((acc, key) => {
    acc[key] = process.env[key];
    return acc;
  }, {});
// JW独自の設定をJSから読めるようにJSONで書き込む.
fs.writeFileSync(path.join(__dirname, 'src', '.env.json'), JSON.stringify(env));


const main = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    index: './src/index.js',
    login: './src/login.js',
    logout: './src/logout.js',
    signup: './src/signup.js',
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
      hash: true,
    }),
    new HtmlWebpackPlugin({
      // inject: false,
      chunks: ['login'],
      template: path.resolve(__dirname, './src/login.html'),
      filename: 'login.html',
      hash: true,
    }),
    new HtmlWebpackPlugin({
      // inject: false,
      chunks: ['logout'],
      template: path.resolve(__dirname, './src/logout.html'),
      filename: 'logout.html',
      hash: true,
    }),
    new HtmlWebpackPlugin({
      // inject: false,
      chunks: ['signup'],
      template: path.resolve(__dirname, './src/signup.html'),
      filename: 'signup.html',
      hash: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: 'app/*.html', to: '', context: 'src/' },
        { from: 'app/*.css', to: '', context: 'src/' },
        { from: 'lib/*.js', to: '', context: 'src/' },
        { from: 'styles/*', to: '', context: 'src/' },
        { from: 'img/*', to: '', context: '' },
        { from: 'text/*', to: '', context: '' },
        { from: 'require.js', to: 'lib/', context: 'node_modules/requirejs/' },
        {
          from: 'rxjs.umd.min.js',
          to: 'lib/',
          context: 'node_modules/rxjs/bundles/',
        },
        { from: '.env.json', to: '', context: 'src/' },
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
        test: /\.json$/,
        type: 'javascript/auto',
        use: { loader: 'json-loader' },
      },
    ],
  },
  devtool: 'inline-source-map',
};
const library = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    jw: './src/scripts/jw.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'lib'),
    filename: '[name].min.js',
    library: 'JW',
    libraryExport: '',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  plugins: [],
  externals: [],
  module: {
    rules: [
      {
        test: /\.json$/,
        type: 'javascript/auto',
        use: { loader: 'json-loader' },
      },
    ],
  },
  devtool: 'inline-source-map',
};

module.exports = [main, library];
