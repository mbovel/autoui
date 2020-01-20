const path = require("path")

module.exports = {
	mode: 'development',
	entry: ['./demo.tsx'],
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
		/*"alias": {
			"react": "preact/compat",
			"react-dom/test-utils": "preact/test-utils",
			"react-dom": "preact/compat",
			// Must be below test-utils
		},*/
	},
	context: path.resolve(__dirname),
	output: {
		path: path.resolve(__dirname, 'dist')
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
