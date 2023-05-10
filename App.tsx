import { useFonts } from 'expo-font'
import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'
import Toast from 'react-native-toast-message'
import * as SplashScreen from 'expo-splash-screen'
import { enableScreens } from 'react-native-screens'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { adaptNavigationTheme, Provider as PaperProvider, useTheme } from 'react-native-paper'

import Splash from '@/components/Splash'
import Loading from '@/components/Loading'
import NavigationProvider from '@/navigation'
import PreferencesContextProvider from '@/contexts/PreferencesContext'

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
	/* reloading the app might trigger some race conditions, ignore them */
})

enableScreens()

export default function App() {
	const theme = useTheme() //? https://callstack.github.io/react-native-paper/docs/guides/theming/#extending-the-theme
	const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme })

	const [fontsLoaded, error] = useFonts({
		'WorkSans-Medium': require('@/assets/fonts/WorkSans-Medium.ttf')
	})

	const { statusBarHeight } = Constants

	return (
		<SafeAreaProvider style={{ marginTop: -statusBarHeight / 2 }}>
			<PreferencesContextProvider>
				<PaperProvider theme={theme}>
					<Splash image={{ uri: Constants.manifest.splash.image }}>
						<StatusBar /* style={theme.dark ? 'light' : 'dark'} backgroundColor={theme.colors.primary} */ />
						<NavigationContainer theme={LightTheme}>
							<Loading />
							<NavigationProvider />
							<Toast topOffset={80} />
						</NavigationContainer>
					</Splash>
				</PaperProvider>
			</PreferencesContextProvider>
		</SafeAreaProvider>
	)
}