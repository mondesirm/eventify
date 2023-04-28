import React from 'react'
import { StatusBar } from 'expo-status-bar'
import Toast from 'react-native-toast-message'
import { enableScreens } from 'react-native-screens'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { adaptNavigationTheme, Provider as PaperProvider, useTheme } from 'react-native-paper'

import Loading from '@/components/Loading'
import NavigationProvider from '@/navigation'
// import AppRouter from '@/components/AppRouter'
import PreferencesContextProvider from '@/contexts/PreferencesContext'

enableScreens()

export default function App() {
	const theme = useTheme() //? https://callstack.github.io/react-native-paper/docs/guides/theming/#extending-the-theme
	const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme })

	return (
		<SafeAreaProvider>
			<PreferencesContextProvider>
				<PaperProvider theme={theme}>
					<StatusBar /* style={theme.dark ? 'light' : 'dark'} backgroundColor={theme.colors.primary} */ />
					<NavigationContainer theme={LightTheme}>
						<NavigationProvider />
						<Loading />
						<Toast />
					</NavigationContainer>
				</PaperProvider>
			</PreferencesContextProvider>
		</SafeAreaProvider>
	)
}