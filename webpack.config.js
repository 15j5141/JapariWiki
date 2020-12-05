const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

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
    new HtmlWebpackPlugin({
      // inject: false,
      chunks: ['signup'],
      template: path.resolve(__dirname, './src/signup.html'),
      filename: 'signup.html',
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
    rules: [],
  },
  devtool: 'inline-source-map',
};

module.exports = [main, library];
