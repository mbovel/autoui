const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	mode: 'production',
	resolve: {
		symlinks: false,
		alias: {
			"react": "preact/compat",
			"react-dom/test-utils": "preact/test-utils",
			"react-dom": "preact/compat",
			// Must be below test-utils
		},
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: [
							["@babel/plugin-transform-react-jsx", {
							}]
						]
					}
				}
			}
		],
	},
	plugins: [new BundleAnalyzerPlugin({ analyzerMode: "static", openAnalyzer: false })],
	devtool: '#source-map',
}
