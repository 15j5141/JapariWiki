const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	entry: {
		entry: './entry.js',
		entry2: './entry2.js'
	},
	output: {
		path: __dirname + '/dist',
		filename: 'js/[name].js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			// inject: false,
			chunks: ['entry'],
			filename: 'index.html'
		}),
		new HtmlWebpackPlugin({
			// inject: false,
			chunks: ['entry2'],
			template:'temp.html',
			filename: 'app/sub.html'
		})
	]
}
