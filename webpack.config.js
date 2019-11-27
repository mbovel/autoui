module.exports = {
	mode: 'production',
	entry: ['./src/demo.tsx'],
	resolve: {
		extensions: ['.js', '.ts', '.tsx', '.json']
	},
	devtool: '#source-map',
	optimization: {
		usedExports: true,
	},
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
