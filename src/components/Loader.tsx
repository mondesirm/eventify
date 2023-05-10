import { Color } from 'GlobalStyles'
import { useEffect, useState } from 'react'
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native'

const steps = 4
const loading = new Animated.Value(0)
const { width, height } = Dimensions.get('screen')

export default function Loader({ until }: { until: boolean }) {
	const loop = Animated.loop(
		Animated.sequence([
			Animated.timing(loading, { toValue: 1, duration: 500, useNativeDriver: false, easing: Easing.bezier(.5, 0, .5, 1) }),
			Animated.timing(loading, { toValue: 0, duration: 500, useNativeDriver: false, easing: Easing.bezier(.5, 0, .5, 1) })
		])
	)

	loop.start()

	useEffect(() => until && loop.stop(), [until])

	return (
		<View style={styles.screen}>
			<View style={styles.dots}>
				{Array.from({ length: steps }).map((_, i) => {
					const animation = {
						height: loading.interpolate({
							inputRange: [i - 1, i, i + 1].map(v => v / (steps - 1)),
							outputRange: [10, 28, 10],
							extrapolate: 'clamp'
						}),
						opacity: loading.interpolate({
							inputRange: [i - 1, i, i + 1].map(v => v / (steps - 1)),
							outputRange: [.5, 1, .5],
							extrapolate: 'clamp'
						})
					}

					return (<Animated.View key={i} style={[styles.dot, animation]} />)
				})}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		width,
		height,
		position: 'absolute'
	},
	dots: {
		gap: 8,
		height,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center'
	},
	dot: {
		width: 10,
		borderRadius: 5,
		backgroundColor: Color.primary
	}
})