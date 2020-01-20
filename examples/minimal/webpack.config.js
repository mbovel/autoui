const path = require("path")
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
	mode: 'production',
	resolve: {
		alias: {
			"react": "preact/compat",
			"react-dom/test-utils": "preact/test-utils",
			"react-dom": "preact/compat",
			// Must be below test-utils
		},
	},
	plugins: [new CompressionPlugin()],
	devtool: '#source-map',
}
