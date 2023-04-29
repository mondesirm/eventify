import { useCallback, useEffect, useMemo, useState } from 'react'
import { Asset } from 'expo-asset'
import Constants from 'expo-constants'
import * as Updates from 'expo-updates'
import { StatusBar } from 'expo-status-bar'
import Toast from 'react-native-toast-message'
import * as SplashScreen from 'expo-splash-screen'
import { enableScreens } from 'react-native-screens'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { Animated, Button, Platform, StyleSheet, Text, View } from 'react-native'
import { adaptNavigationTheme, Provider as PaperProvider, useTheme } from 'react-native-paper'

import Loading from '@/components/Loading'
import NavigationProvider from '@/navigation'
// import AppRouter from '@/components/AppRouter'
import PreferencesContextProvider from '@/contexts/PreferencesContext'

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
	/* reloading the app might trigger some race conditions, ignore them */
})

enableScreens()

function AnimatedSplashScreen({ children, image }) {
	const animation = useMemo(() => new Animated.Value(1), [])
	const [isAppReady, setAppReady] = useState(false)
	const [isSplashAnimationComplete, setAnimationComplete] = useState(false)

	useEffect(() => {
		if (isAppReady) {
			Animated.timing(animation, {
				toValue: 0,
				duration: 1000,
				useNativeDriver: true
			}).start(() => setAnimationComplete(true))
		}
	}, [isAppReady])

	const onImageLoaded = useCallback(async () => {
		try {
			await SplashScreen.hideAsync()
			// Load stuff
			await Promise.all([])
		} catch (e) {
		} finally { setAppReady(true) }
	}, [])

	return (
		<View style={{ flex: 1 }}>
			{isAppReady && children}

			{!isSplashAnimationComplete &&
				<Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: Constants.manifest.splash.backgroundColor, opacity: animation }]}>
					<Animated.Image
						style={{
							width: '100%',
							height: '100%',
							resizeMode: Constants.manifest.splash.resizeMode || 'contain',
							transform: [{ scale: animation }]
						}}
						source={image}
						onLoadEnd={onImageLoaded}
						fadeDuration={0}
					/>
				</Animated.View>
			}
		</View>
	)
}

function AnimatedAppLoader({ children, image }) {
	const [isSplashReady, setSplashReady] = useState(false)

	useEffect(() => {
		async function prepare() {
			await Asset.fromURI(image.uri).downloadAsync()
			setSplashReady(true)
		}

		prepare()
	}, [image])

	if (!isSplashReady) return null

	return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>
}

export default function App() {
	const theme = useTheme() //? https://callstack.github.io/react-native-paper/docs/guides/theming/#extending-the-theme
	const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme })

	return (
		<SafeAreaProvider>
			<PreferencesContextProvider>
				<PaperProvider theme={theme}>
					<AnimatedAppLoader image={{ uri: Constants.manifest.splash.image }}>
						<StatusBar /* style={theme.dark ? 'light' : 'dark'} backgroundColor={theme.colors.primary} */ />
						<NavigationContainer theme={LightTheme}>
							<NavigationProvider />
							<Loading />
							<Toast />
						</NavigationContainer>
					</AnimatedAppLoader>
				</PaperProvider>
			</PreferencesContextProvider>
		</SafeAreaProvider>
	)
}