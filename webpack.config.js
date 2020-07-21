module.exports = {
	entry: './src/index.js',
	module: {
		loaders: [
			{
				test: /\.svg$/,
				exclude: /node_modules/,
				use: {
					loader: 'svg-react-loader'
				}
			}
		]
	}
};
