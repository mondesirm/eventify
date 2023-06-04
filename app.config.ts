import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	slug: 'eventify',
	name: 'eventify',
	description: 'Planning events made easy.',
	version: '1.0.0',
	orientation: 'portrait',
	icon: 'https://github.com/expo/expo/blob/master/templates/expo-template-blank/assets/icon.png?raw=true',
	userInterfaceStyle: 'light',
	splash: {
		image: 'https://github.com/expo/expo/blob/master/templates/expo-template-blank/assets/splash.png?raw=true',
		resizeMode: 'contain',
		backgroundColor: '#ffffff'
	},
	updates: {
		fallbackToCacheTimeout: 0
	},
	assetBundlePatterns: ['**/*'],
	plugins: [
		'expo-localization',
		[
			'expo-image-picker', {
				photosPermission: 'Allow Eventify to access your photos',
				cameraPermission: 'Allow Eventify to access your camera',
				microphonePermission: 'Allow Eventify to access your microphone'
			}
		]
	],
	ios: {
		supportsTablet: true
	},
	android: {
		adaptiveIcon: {
			foregroundImage: 'https://github.com/expo/expo/blob/master/templates/expo-template-blank/assets/adaptive-icon.png?raw=true',
			backgroundColor: '#FFFFFF'
		}
	},
	web: {
		favicon: 'https://github.com/expo/expo/blob/master/templates/expo-template-blank/assets/favicon.png?raw=true'
	},
	extra: {
		eas: {
			projectId: 'dc763e39-e4a4-4ba0-a9ac-648dc16e5411'
		}
	}
})