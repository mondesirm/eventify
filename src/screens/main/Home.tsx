import { useRef } from 'react'
import { FAB } from 'react-native-paper'
import { NavigationProp } from '@react-navigation/native'
import { Animated, Dimensions, I18nManager, ImageBackground, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'

import Carousel from '@/components/Carousel'
import { Color, FontFamily, FontSize } from 'globals'
import { usePreferences } from '@/contexts/PreferencesContext'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width } = Dimensions.get('screen')
const isAndroidRTL = I18nManager.isRTL && Platform.OS === 'android'

const images = new Array(4).fill('https://images.unsplash.com/photo-1556740749-887f6717d7e4')

// const images = [
// 	require('@/assets/onboarding/0.png'),
// 	require('@/assets/onboarding/1.png'),
// 	require('@/assets/onboarding/2.png'),
// 	require('@/assets/onboarding/3.png')
// ]

const carousel = images.map((image, key) => ({ image: { uri: image }, key }))

export default function ({ navigation, route }: ScreenProps) {
	const { i18n: { __ } } = usePreferences()
	const scrollX = useRef(new Animated.Value(0)).current

	return (
		<ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
			<Carousel items={carousel} color={Color.white} autoplay>
				{({ image }) => (
					<View style={{ width, height: 250 }}>
						<ImageBackground style={styles.screen} source={image} />
					</View>
				)}
			</Carousel>

			<FAB style={styles.fab} icon="bell-outline" onPress={() => console.log('Pressed')} />

			<View style={styles.content}>
				<Text style={[styles.title, styles.typo]}>
					{__('onboarding.0.title')}
				</Text>
				<Text style={[styles.subtitle, styles.typo]}>
					{__('onboarding.0.subtitle')}
				</Text>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	screen: {
		flex: 1
	},
	content: {
		width,
		gap: 16,
		top: '10%'
	},
	typo: {
		fontWeight: '500',
		textAlign: 'center',
		fontFamily: FontFamily.primary
	},
	title: {
		fontSize: FontSize.x2l,
		textTransform: 'capitalize'
	},
	subtitle: {
		color: Color.body,
		fontSize: FontSize.sm
	},
	fab: {
		top: 36,
		right: 0,
		margin: 16,
		borderRadius: 28,
		position: 'absolute',
		backgroundColor: Color.white
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