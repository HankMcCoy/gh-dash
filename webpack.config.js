const path = require('path')

module.exports = {
	entry: './client/src/index.js',
	output: {
		publicPath: '/js',
		path: path.join(__dirname, 'client/dist'),
		filename: 'app.js',
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			}
		]
	}
}
