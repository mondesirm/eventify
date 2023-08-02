import { StatusBar } from 'expo-status-bar'
import { Rating } from 'react-native-ratings'
import Toast from 'react-native-toast-message'
import { LinearGradient } from 'expo-linear-gradient'
import { Avatar, Badge, FAB } from 'react-native-paper'
import { StackNavigationProp } from '@react-navigation/stack'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { Animated, Dimensions, I18nManager, Image, ImageBackground, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { AllowedScope } from '@/locales'
import Section from '@/components/Section'
import Carousel from '@/components/Carousel'
import SearchBar from '@/components/SearchBar'
import Categories from '@/components/Categories'
import { Border, Color, FontFamily, FontSize } from 'globals'
import { useI18n, useNavs } from '@/contexts/PreferencesContext'
import { Event, Place, useStoreActions, useStoreState } from '@/store'

interface ScreenProps {
	navigation: StackNavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width, height } = Dimensions.get('window')
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
				scrollEventThrottle={16}
				keyboardDismissMode="interactive"
				keyboardShouldPersistTaps="handled"
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
				onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: false } )}
			>
				<View style={styles.content}>
					<SearchBar value={search} onChangeText={setSearch} />
					<Categories style={{ marginVertical: 32 }} limit={6} refreshing={refreshing} />

					<Section path="places" limit={6} refreshing={refreshing}>
						{(items, styles) => items.map((_: Place<true>) => (
							<TouchableOpacity key={_.id} style={styles.block} onPress={() => navigation.navigate('ExploreStack', { screen: 'Place', params: { _ } })}>
								<Image style={styles.image} resizeMode="cover" source={{ uri : _.uri || 'https://fakeimg.pl/260/5f60b9/FFF/?text=No%20Image&font=lobster&font_size=50' }} />
								{_.category?.name && <Badge style={styles.category}>{_.category?.name}</Badge>}

								<View style={styles.container}>
									<Badge style={styles.badge} size={25}>{_.price === 0 ? 'FREE' : '$' + (_.price === Number(_.price.toFixed(0)) ? _.price : _.price.toFixed(2))}</Badge>

									<View style={styles.row}>
										<Rating imageSize={10} readonly startingValue={_.ratings && _.ratings.length > 0 ? _.ratings.reduce((a, b) => a + b.value, 0) / _.ratings.length : 0} />
										<Text style={[styles.text, styles.typo, { color: Color.body }]}>{_.ratings && _.ratings.length > 0 ? (_.ratings.reduce((a, b) => a + b.value, 0) / _.ratings.length).toFixed(1) : '∅'} ({ _.ratings.length || 0 })</Text>
									</View>

									<Text style={[styles.text, styles.typo]}>{_.name}</Text>

									<View style={styles.row}>
										<Avatar.Image size={20} source={{ uri: 'https://picsum.photos/seed/picsum/200/300' }} />
										<Text style={[styles.text, styles.typo, { color: Color.body }]}>{'@eventify'}</Text>
									</View>
								</View>
							</TouchableOpacity>
						))}
					</Section>

					<Section path="events" limit={6} refreshing={refreshing} predicate={(_: Event<true>[]) => _.filter(_ => _.visibility === 'public')}>
						{(items, styles) => items.map((_: Event<true>) => (
							<TouchableOpacity key={_.id} style={styles.block} onPress={() => navigation.navigate('ExploreStack', { screen: 'Event', params: { _ } })}>
								<Image style={styles.image} resizeMode="cover" source={{ uri : _.uri || 'https://fakeimg.pl/260/5f60b9/FFF/?text=No%20Image&font=lobster&font_size=50' }} />
								{_.category?.name && <Badge style={styles.category}>{_.category?.name}</Badge>}

								<View style={styles.container}>
									<Badge style={styles.badge} size={25}>{Number(_.attendees?.length ?? 0) + ' / ' + (_.limit ? _.limit : '∞')}</Badge>

									<View style={styles.row}>
										<Rating imageSize={10} readonly startingValue={_.ratings ? _.ratings.reduce((a, b) => a + b.value, 0) / _.ratings.length : 3} />
										<Text style={[styles.text, styles.typo, { color: Color.body }]}>{_.ratings && _.ratings.length > 0 ? (_.ratings.reduce((a, b) => a + b.value, 0) / _.ratings.length).toFixed(1) : '∅'} ({ _.ratings.length || 0 })</Text>
									</View>

									<Text style={[styles.text, styles.typo]}>{_.title}</Text>

									{/* <View style={styles.row}>
										<Text style={[styles.text, styles.typo, { color: Color.body }]}>
											{_.start.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
											{_.end.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) !== _.start.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) && ' • ' + _.end.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
										</Text>
									</View> */}

									<View style={styles.row}>
										<Avatar.Image size={20} source={{ uri: _.owner?.uri || 'https://picsum.photos/seed/picsum/200/300' }} />
										<Text style={[styles.text, styles.typo, { color: Color.body }]}>@{_.owner?.username ?? 'eventify'}</Text>
									</View>
								</View>
							</TouchableOpacity>
						))}
					</Section>
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
		marginTop: -28,
		paddingHorizontal: 20
	},
	fab: {
		top: 36,
		right: 0,
		margin: 16,
		borderRadius: 28,
		position: 'absolute',
		backgroundColor: Color.white
	}
})