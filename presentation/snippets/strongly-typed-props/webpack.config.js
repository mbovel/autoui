const path = require("path")

module.exports = {
	mode: 'development',
	entry: ['./strongly-typed-props'],
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
	},
	context: path.resolve(__dirname),
	output: {
		path: path.resolve(__dirname, 'dist')
	},
	devtool: '#source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
}
