module.exports = function (api) {
	api.cache(true)
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			['module-resolver', { root: ['./'], alias: { '@': './src/' }, extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'] }],
			['module:react-native-dotenv', { allowUndefined: false, safe: true }],
			'react-native-reanimated/plugin'
		],
		env: {
			production: { plugins: ['react-native-paper/babel'] }
		}
	}
}