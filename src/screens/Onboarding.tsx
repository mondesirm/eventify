import { useEffect, useRef, useState } from 'react'
import { NavigationProp } from '@react-navigation/native'
import AppIntroSlider from 'react-native-app-intro-slider'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { Animated, Dimensions, I18nManager, Image, Platform, SafeAreaView, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'

import { Translation } from '@/locales'
import { Color, FontFamily, FontSize } from 'GlobalStyles'
import { usePreferences } from '@/contexts/PreferencesContext'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

interface BtnProps {
	text?: Translation
	name?: keyof typeof MaterialCommunityIcons.glyphMap
	styles: StyleProp<ViewStyle> | [StyleProp<ViewStyle>, StyleProp<TextStyle>]
}

const scrollX = new Animated.Value(0)
const { width, height } = Dimensions.get('screen')
const isAndroidRTL = I18nManager.isRTL && Platform.OS === 'android'

const images = [
	require('@/assets/onboarding/0.png'),
	require('@/assets/onboarding/1.png'),
	require('@/assets/onboarding/2.png'),
	require('@/assets/onboarding/3.png')
]

const steps = images.map((image, key) => ({ image, key }))

export default function Onboarding({ navigation }: ScreenProps) {
	const { i18n: { __ } } = usePreferences()
	const slider = useRef<AppIntroSlider>(null)
	const [step, setStep] = useState(slider.current?.state.activeIndex || 0)

	useEffect(() => slider.current?.goToSlide(step), [step])

	const renderItem = ({ item }: { item: typeof steps[0] & { key: string } }) => {
		return (
			<View style={styles.screen}>
				<View style={styles.header}>
					<Image style={styles.circle} source={require('@/assets/onboarding/circle.png')} />
					<Image style={styles.person} source={item.image} />
				</View>

				<View style={styles.content}>
					<Text style={[styles.title, styles.typo]}>{__(`onboarding.${item.key}.title`)}</Text>
					<Text style={[styles.subtitle, styles.typo]}>{__(`onboarding.${item.key}.subtitle`)}</Text>
				</View>
			</View>
		)
	}

	const renderPagination = (step: number) => {
		const isLast = step === steps.length - 1
		const leftBtn = !isLast && Skip()
		const rightBtn = isLast ? Done() : Next()

		return (
			<View style={styles.pagination}>
				<SafeAreaView>
					<View style={styles.left}>
						<TouchableOpacity onPress={slider.current?.props.onDone}>
							{leftBtn}
						</TouchableOpacity>
					</View>

					<View style={styles.dots}>
						{steps.map((_, i) => {
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
									<Animated.View style={[styles.dot, animation]} />
								</TouchableOpacity>
							)
						})}
					</View>

					<View style={styles.right}>
						<TouchableOpacity onPress={() => isLast ? slider.current?.props.onDone() : setStep(step + 1)}>
							{rightBtn}
						</TouchableOpacity>
					</View>
				</SafeAreaView>
			</View>
		)
	}

	const Btn = ({ text, name, styles }: BtnProps) => {
		return (
			<View style={styles[0]}>
				{text ? <Text style={styles[1]}>{__(text)}</Text> : <Icon name={name} color="white" size={24} /> }
			</View>
		)
	}
	
	const Done = () => Btn({ name: 'check', styles: [styles.button] })
	const Next = () => Btn({ name: 'arrow-right', styles: [styles.button] })
	const Skip = () => Btn({ text: 'skip', styles: [[styles.button, styles.skip], [styles.link, styles.typo]] })

	return (
		<AppIntroSlider
			ref={slider}
			data={steps}
			renderItem={renderItem}
			scrollEventThrottle={1}
			onSlideChange={i => setStep(i)}
			renderPagination={renderPagination}
			onDone={() => navigation.navigate('AuthStack')}
			onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
		/>
	)
}

const styles = StyleSheet.create({
	screen: {
		flex: 1
	},
	header: {
		height,
		left: 20,
		top: '-25%',
		position: 'absolute'
	},
	circle: {
		left: 28,
		top: '-10%',
		position: 'absolute'
	},
	person: {
		top: '36%'
	},
	content: {
		gap: 16,
		left: 20,
		top: '60%',
		width: width - 40
	},
	typo: {
		fontWeight: '500',
		fontFamily: FontFamily.primary
	},
	title: {
		fontSize: FontSize.title,
		textTransform: 'capitalize'
	},
	subtitle: {
		color: Color.body,
		fontSize: FontSize.sm
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
	},
	left: {
		left: 0,
		position: 'absolute'
	},
	right: {
		right: 0,
		position: 'absolute'
	},
	button: {
		width: 48,
		height: 48,
		borderRadius: 25,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Color.primary
	},
	skip: {
		backgroundColor: 'transparent'
	},
	link: {
		color: Color.primary,
		fontSize: FontSize.base,
		textDecorationLine: 'underline'
	}
})