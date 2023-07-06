import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	slug: 'eventify',
	name: 'eventify',
	description: 'Planning events made easy.',
	version: '1.0.0',
	sdkVersion: '48.0.0',
	runtimeVersion: {
		policy: 'sdkVersion'
	},
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
				photosPermission: 'Allow $(PRODUCT_NAME) to access your photos',
				cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
				microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone'
			}
		],
		[
			'expo-location', {
				locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to access your location'
			}
		]
	],
	ios: {
		bundleIdentifier: 'com.mondesirm.eventify',
		buildNumber: '1.0.0'
	},
	android: {
		package: 'com.mondesirm.eventify',
		versionCode: 1,
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