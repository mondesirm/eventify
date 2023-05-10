module.exports = function (api) {
	api.cache(true)
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			[
				'module-resolver',
				{
					root: ['./'],
					alias: {
						'@': './src/'
					},
					extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
				}
			],
			'react-native-reanimated/plugin'
		],
		env: {
			production: {
				plugins: ['react-native-paper/babel']
			}
		}
	}
}