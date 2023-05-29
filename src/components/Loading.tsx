import { useEffect } from 'react'
import Spinner from 'react-native-loading-spinner-overlay'
import { Animated, Easing, StyleSheet, View } from 'react-native'

import { Color } from 'globals'
import { useStoreState } from '@/store'

const steps = 4
const value = new Animated.Value(0)

const Loader = ({ when }: { when?: boolean }) => {
	const loop = Animated.loop(
		Animated.sequence([
			Animated.timing(value, { toValue: 1, duration: 500, useNativeDriver: false, easing: Easing.bezier(.5, 0, .5, 1) }),
			Animated.timing(value, { toValue: 0, duration: 500, useNativeDriver: false, easing: Easing.bezier(.5, 0, .5, 1) })
		])
	)

	loop.start()

	useEffect(() => { !when && loop.stop() }, [when])

	return (
		<View style={styles.dots}>
			{Array.from({ length: steps }).map((_, i) => {
				const animation = {
					height: value.interpolate({
						inputRange: [i - 1, i, i + 1].map(v => v / (steps - 1)),
						outputRange: [10, 28, 10],
						extrapolate: 'clamp'
					}),
					opacity: value.interpolate({
						inputRange: [i - 1, i, i + 1].map(v => v / (steps - 1)),
						outputRange: [.5, 1, .5],
						extrapolate: 'clamp'
					})
				}

				return (<Animated.View key={i} style={[styles.dot, animation]} />)
			})}
		</View>
	)
}

export default function Loading() {
	const { loading } = useStoreState(({ user }) => user)
	return <Spinner visible={loading} color={Color.primary} animation="fade" customIndicator={<Loader when={loading} />} />
}

const styles = StyleSheet.create({
	dots: {
		gap: 8,
		alignItems: 'center',
		flexDirection: 'row'
	},
	dot: {
		width: 10,
		borderRadius: 5,
		backgroundColor: Color.primary
	}
})