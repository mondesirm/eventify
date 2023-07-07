import { FAB } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useEffect, useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { Dimensions, I18nManager, ImageBackground, Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native'

import Places from '@/components/Places'
import { AllowedScope } from '@/locales'
import Carousel from '@/components/Carousel'
import SearchBar from '@/components/SearchBar'
import Categories from '@/components/Categories'
import { Color, FontFamily, FontSize } from 'globals'
import { useStoreActions, useStoreState } from '@/store'
import { useI18n, useNavs } from '@/contexts/PreferencesContext'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

interface ScreenProps {
	navigation: StackNavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width, height } = Dimensions.get('screen')
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
	const bottomTabBarHeight = useBottomTabBarHeight()
	const [refreshing, setRefreshing] = useState(false)
	const logout = useStoreActions(({ auth }) => auth.logout)
	const currentUser = useStoreState(({ user }) => user?.currentUser)

	// useEffect(() => { console.log('Home', currentUser) }, [currentUser?.roles])

	const onRefresh = useCallback(() => {
		setRefreshing(true)
		setTimeout(() => setRefreshing(false), 2000)
	}, [])

	const onPress = () => {
		logout()
			.then((res: AllowedScope[]) => {
				Toast.show({ text1: __(res[0]), text2: __(res[1]) })
				// navigation.replace('AuthStack')
			})
			.catch((err: AllowedScope[]) => Toast.show({ type: 'error', text1: __(err[0]), text2: __(err[1]) }))
	}

	return (
		<ScrollView style={[styles.screen, { height: height - bottomTabBarHeight }]} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
			<Carousel items={carousel} color={Color.white} autoplay>
				{({ image }) => (
					// TODO fix gradient
					<LinearGradient style={{ height: 250 }} locations={[0, 1]} colors={['#000', '#0000']}>
						<ImageBackground style={styles.screen} source={image} />
					</LinearGradient>
				)}
			</Carousel>

			<FAB style={styles.fab} icon="logout" onPress={onPress} />

			<View style={[styles.content, { marginTop: -28 }]}>
				<SearchBar value={search} onBlur={() => setSearch('')} onChangeText={setSearch} />
				<Categories limit={6} refreshing={refreshing} />
				<Places limit={6} refreshing={refreshing} />
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	screen: {
		...StyleSheet.absoluteFillObject,
		overflow: 'visible',
		backgroundColor: Color.white
	},
	content: {
		gap: 32,
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