const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	entry: {
		index: './js/index.js',
		edit: './app/edit.js',
		load: './app/load.js',
		upload: './app/upload.js',
	},
	output: {
		path: __dirname + '/dist',
		filename: 'js/[name].js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			// inject: false,
			chunks: ['index'],
			template: 'app/index.html',
			filename: 'app/index.html'
		}),
		new HtmlWebpackPlugin({
			chunks: ['load'],
			template: 'app/load.html',
			filename: 'app/load.html'
		}),
		new HtmlWebpackPlugin({
			chunks: ['edit'],
			template: 'app/edit.html',
			filename: 'app/edit.html'
		}),
	]
}
