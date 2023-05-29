import { useFonts } from 'expo-font'
import Constants from 'expo-constants'
import { StoreProvider } from 'easy-peasy'
import { StatusBar } from 'expo-status-bar'
import Toast from 'react-native-toast-message'
import * as SplashScreen from 'expo-splash-screen'
import { enableScreens } from 'react-native-screens'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { adaptNavigationTheme, Provider as PaperProvider, useTheme } from 'react-native-paper'

import store from '@/store'
import { Color } from 'globals'
import Splash from '@/components/Splash'
import Loading from '@/components/Loading'
import NavigationProvider from '@/navigation'
import IconlyProvider from '@/contexts/IconlyContext'
import AnalyticsProvider from '@/contexts/AnalyticsContext'
import PreferencesProvider from '@/contexts/PreferencesContext'

enableScreens()
SplashScreen.preventAutoHideAsync()

export default function App() {
	const theme = useTheme() //? https://callstack.github.io/react-native-paper/docs/guides/theming/#extending-the-theme
	const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme })

	const [fonts] = useFonts({
		'WorkSans-Black': require('@/assets/fonts/WorkSans-Black.ttf'),
		'WorkSans-BlackItalic': require('@/assets/fonts/WorkSans-BlackItalic.ttf'),
		'WorkSans-Bold': require('@/assets/fonts/WorkSans-Bold.ttf'),
		'WorkSans-BoldItalic': require('@/assets/fonts/WorkSans-BoldItalic.ttf'),
		'WorkSans-ExtraBold': require('@/assets/fonts/WorkSans-ExtraBold.ttf'),
		'WorkSans-ExtraBoldItalic': require('@/assets/fonts/WorkSans-ExtraBoldItalic.ttf'),
		'WorkSans-ExtraLight': require('@/assets/fonts/WorkSans-ExtraLight.ttf'),
		'WorkSans-ExtraLightItalic': require('@/assets/fonts/WorkSans-ExtraLightItalic.ttf'),
		'WorkSans-Italic': require('@/assets/fonts/WorkSans-Italic.ttf'),
		'WorkSans-Light': require('@/assets/fonts/WorkSans-Light.ttf'),
		'WorkSans-LightItalic': require('@/assets/fonts/WorkSans-LightItalic.ttf'),
		'WorkSans-Medium': require('@/assets/fonts/WorkSans-Medium.ttf'),
		'WorkSans-MediumItalic': require('@/assets/fonts/WorkSans-MediumItalic.ttf'),
		'WorkSans-Regular': require('@/assets/fonts/WorkSans-Regular.ttf'),
		'WorkSans-SemiBold': require('@/assets/fonts/WorkSans-SemiBold.ttf'),
		'WorkSans-SemiBoldItalic': require('@/assets/fonts/WorkSans-SemiBoldItalic.ttf'),
		'WorkSans-Thin': require('@/assets/fonts/WorkSans-Thin.ttf'),
		'WorkSans-ThinItalic': require('@/assets/fonts/WorkSans-ThinItalic.ttf')
	})

	return (
		<SafeAreaProvider>
			<AnalyticsProvider>
				<PreferencesProvider>
					<PaperProvider theme={theme}>
						<IconlyProvider set="two-tone" primaryColor={Color.primary} secondaryColor={Color.secondary} stroke="bold" size="xlarge">
							<Splash image={{ uri: Constants.manifest.splash.image }} fonts={fonts}>
								<StatusBar />
								<NavigationContainer theme={LightTheme}>
									<StoreProvider store={store}>
										<NavigationProvider />
										<Loading />
										<Toast topOffset={80} />
									</StoreProvider>
								</NavigationContainer>
							</Splash>
						</IconlyProvider>
					</PaperProvider>
				</PreferencesProvider>
			</AnalyticsProvider>
		</SafeAreaProvider>
	)
}