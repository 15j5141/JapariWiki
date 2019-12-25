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
	],
	externals: [
		{
			jquery: 'jQuery',
			ncmb: 'NCMB'
		}
	],
	module: {
		rules: [
			{
				test: /\.sjs$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							[
								"@babel/preset-env",
								{
									useBuiltIns: "usage",
									corejs: 3 // or 2
								}
							]
						]
					}
				}
			},
			{
				// npm install json-loader --save-dev
				test: /\.json$/,
				loader: 'json'
			},
		]
	},
}
