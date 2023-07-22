import _ from 'lodash'
import { JSX } from 'react'
import { useEffect, useRef, useState } from 'react'
import AppIntroSlider from 'react-native-app-intro-slider'
import { Animated, Dimensions, I18nManager, Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native'

import { Color } from 'globals'

interface CarouselProps extends Partial<AppIntroSlider<{ image: any, key: string }[]>> {
	items: { image: any, key: number }[]
	color?: string
	autoplay?: boolean
	speed?: number
	onDone?: () => void
	children: ({ image, key }) => JSX.Element
}

const { width } = Dimensions.get('window')
const isAndroidRTL = I18nManager.isRTL && Platform.OS === 'android'

export default function Carousel(props: CarouselProps) {
	const slider = useRef<AppIntroSlider>(null)
	const scrollX = useRef(new Animated.Value(0)).current
	const [timer, setTimer] = useState<NodeJS.Timeout>(null)
	const [step, setStep] = useState(slider.current?.state.activeIndex || 0)

	useEffect(() => {
		if (step === props.items.length) setStep(0)
		slider.current?.goToSlide(step)
	}, [step])

	const start = () => {
		if (timer) return
		setTimer(setInterval(() => setStep(step => step + 1), props.speed || 3000))
	}

	const stop = () => {
		if (!timer) return
		clearInterval(timer)
		setTimer(null)
	}

	const renderPagination = (step: number) => (
		<View style={styles.pagination}>
			<SafeAreaView>
				<View style={styles.dots}>
					{props.items.map((_, i) => {
						const animation = {
							width: scrollX.interpolate({
								inputRange: [i - 1, i, i + 1].map(v => v * width),
								outputRange: [10, 28, 10],
								extrapolate: 'clamp'
							}),
							opacity: scrollX.interpolate({
								inputRange: [i - 1, i, i + 1].map(v => v * width),
								outputRange: [.5, 1, .5],
								extrapolate: 'clamp'
							})
						}

						return (
							<TouchableOpacity key={i} onPress={() => setStep(i)}>
								<Animated.View style={[styles.dot, props.color && { backgroundColor: props.color }, animation]} />
							</TouchableOpacity>
						)
					})}
				</View>
			</SafeAreaView>
		</View>
	)

	const onSlideChange = (index: number) => {
		stop()
		setStep(index)
		setTimeout(start, 2000)
	}

	if (props.autoplay) start()

	return (
		<AppIntroSlider
			ref={slider}
			data={props.items}
			renderItem={({ item }) => props.children(item)}
			scrollEventThrottle={1}
			onSlideChange={onSlideChange}
			renderPagination={renderPagination}
			onDone={props.onDone}
			onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
		/>
	)
}

const styles = StyleSheet.create({
	screen: {
		flex: 1
	},
	pagination: {
		left: 16,
		right: 16,
		bottom: 16,
		position: 'absolute'
	},
	dots: {
		gap: 8,
		height: 16,
		margin: 16,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: isAndroidRTL ? 'row-reverse' : 'row'
	},
	dot: {
		height: 10,
		borderRadius: 5,
		backgroundColor: Color.primary
	}
})