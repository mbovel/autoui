module.exports = {
	mode: 'development',
	entry: ['./src/demo.tsx'],
	resolve: {
		extensions: ['.js', '.ts', '.tsx', '.json']
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
