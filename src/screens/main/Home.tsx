import { FAB } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar'
import Toast from 'react-native-toast-message'
import { LinearGradient } from 'expo-linear-gradient'
import { StackNavigationProp } from '@react-navigation/stack'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { Animated, Dimensions, I18nManager, ImageBackground, Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native'

import { AllowedScope } from '@/locales'
import Section from '@/components/Section'
import Carousel from '@/components/Carousel'
import SearchBar from '@/components/SearchBar'
import Categories from '@/components/Categories'
import { Color, FontFamily, FontSize } from 'globals'
import { useStoreActions, useStoreState } from '@/store'
import { useI18n, useNavs } from '@/contexts/PreferencesContext'

interface ScreenProps {
	navigation: StackNavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { height } = Dimensions.get('screen')
const isAndroidRTL = I18nManager.isRTL && Platform.OS === 'android'

const images = new Array(4).fill('https://loremflickr.com/640/480/people')

// const images = [
// 	require('@/assets/onboarding/0.png'),
// 	require('@/assets/onboarding/1.png'),
// 	require('@/assets/onboarding/2.png'),
// 	require('@/assets/onboarding/3.png')
// ]

const carousel = images.map((uri, key) => ({ image: { uri }, key }))

export default function Home({ navigation, route }: ScreenProps) {
	const { __ } = useI18n()
	const { dismiss } = useNavs()
	const [search, setSearch] = useState('')
	const y = useRef(new Animated.Value(0)).current
	const bottomTabBarHeight = useBottomTabBarHeight()
	const [refreshing, setRefreshing] = useState(false)
	const logout = useStoreActions(({ auth }) => auth.logout)
	const currentUser = useStoreState(({ user }) => user?.currentUser)
	const setFirstVisits = useStoreActions(({ utils }) => utils.setFirstVisits)

	const animation = {
		transform: [
			// { scale: y.interpolate({ inputRange: [0, 250 - 80], outputRange: [1, 1.2], extrapolate: 'clamp' }) },
			{ translateY: y.interpolate({ inputRange: [0, 250], outputRange: [0, -250], extrapolate: 'clamp' }) }
		]
	}

	useEffect(() => { setFirstVisits({ home: false }) }, [])

	const onRefresh = useCallback(() => {
		setRefreshing(true)
		setTimeout(() => setRefreshing(false), 2000)
	}, [])

	const onPress = () => {
		logout()
			.then((res: AllowedScope[]) => Toast.show({ text1: __(res[0]), text2: __(res[1]) }))
			.catch((err: AllowedScope[]) => Toast.show({ type: 'error', text1: __(err[0]), text2: __(err[1]) }))
	}

	return (
		<View style={[styles.screen, { height: height - bottomTabBarHeight }]}>
			<StatusBar style="light" />

			<Animated.View style={[{ height: 250 }, animation]}>
				<Carousel items={carousel} color={Color.white} autoplay>
					{({ image }) => (<>
						<LinearGradient style={styles.gradient} colors={['#000C', '#0000']} />
						<ImageBackground style={styles.screen} source={image} />
					</>)}
				</Carousel>

				<FAB style={styles.fab} icon="logout" onPress={onPress} />
			</Animated.View>

			<ScrollView
				style={{ overflow: 'visible' }}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="interactive"
				scrollEventThrottle={16}
				onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: false } )}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
				// stickyHeaderIndices={[0]}
			>

				<View style={[styles.content, { marginTop: -28 }]}>
					<SearchBar value={search} onBlur={() => setSearch('')} onChangeText={setSearch} />
					<Categories style={{ marginVertical: 32 }} limit={6} refreshing={refreshing} />
					<Section type="place" limit={6} refreshing={refreshing} />
					<Section type="event" limit={6} refreshing={refreshing} />
				</View>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	screen: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Color.white
	},
	gradient: {
		...StyleSheet.absoluteFillObject,
		zIndex: 1,
	},
	content: {
		paddingHorizontal: 20
	},
	typo: {
		textAlign: 'center',
		fontFamily: FontFamily.medium
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