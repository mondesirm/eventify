import { useCallback, useEffect, useMemo, useState } from 'react'
import { Asset } from 'expo-asset'
import Constants from 'expo-constants'
import * as SplashScreen from 'expo-splash-screen'
import { Animated, StyleSheet, View } from 'react-native'

function AnimatedSplash({ children, image }) {
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

export default function Splash({ children, image }) {
	const [isSplashReady, setSplashReady] = useState(false)

	useEffect(() => {
		async function prepare() {
			await Asset.fromURI(image.uri).downloadAsync()
			setSplashReady(true)
		}

		prepare()
	}, [image])

	if (!isSplashReady) return null

	return <AnimatedSplash image={image}>{children}</AnimatedSplash>
}