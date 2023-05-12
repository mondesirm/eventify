import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	slug: 'eventify',
	name: 'eventify',
	icon: 'https://github.com/expo/expo/blob/master/templates/expo-template-blank/assets/icon.png?raw=true',
	splash: {
		image: 'https://github.com/expo/expo/blob/master/templates/expo-template-blank/assets/splash.png?raw=true',
		resizeMode: 'contain',
		backgroundColor: '#ffffff'
	},
	"plugins": [
		"expo-localization"
	],
	"extra": {
		"eas": {
			"projectId": "dc763e39-e4a4-4ba0-a9ac-648dc16e5411"
		}
	}
})