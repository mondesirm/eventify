import { Asset } from 'expo-asset'
import Constants from 'expo-constants'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, AppState, StyleSheet, View } from 'react-native'

function AnimatedSplash({ children, image }) {
	const appState = useRef(AppState.currentState)
	const [appReady, setAppReady] = useState(false)
	const animation = useRef(new Animated.Value(1)).current
	const [isSplashAnimationComplete, setAnimationComplete] = useState(false)

	useEffect(() => {
		if (appReady) {
			Animated.timing(animation, {
				toValue: 0,
				duration: 1000,
				useNativeDriver: true
			}).start(() => setAnimationComplete(true))
		}
	}, [appReady])

	// useEffect(() => {
	// 	const subscription = AppState.addEventListener('change', nextState => {
	// 		if (
	// 			appState.current.match(/inactive|background/) &&
	// 			nextState === 'active'
	// 		) {
	// 			Animated.timing(animation, {
	// 				toValue: 1,
	// 				duration: 0,
	// 				useNativeDriver: true
	// 			}).start(() => setAnimationComplete(false))
	// 			setAppReady(false)
	// 		}

	// 		appState.current = nextState
	// 		console.log('AppState', appState.current)
	// 	})

	// 	return () => subscription.remove()
	// }, [])

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
			{appReady && children}

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

export default ({ children, image, fonts }) => {
	const [isSplashReady, setSplashReady] = useState(false)

	useEffect(() => {
		async function prepare() {
			await Asset.fromURI(image.uri).downloadAsync()
			setSplashReady(true)
		}

		prepare()
	}, [image])

	if (!isSplashReady || !fonts) return null

	return <AnimatedSplash image={image}>{children}</AnimatedSplash>
}