module.exports = {
	mode: 'production',
	entry: ['./src/index.tsx'],
	resolve: {
		extensions: ['.js', '.ts', '.tsx', '.json']
	},
	output: {
		filename: 'bundle.min.js',
		libraryTarget: 'var',
		library: 'codeoz'
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
