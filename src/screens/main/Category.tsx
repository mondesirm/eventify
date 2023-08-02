import { Rating } from 'react-native-ratings'
import { useCallback, useEffect, useState } from 'react'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { RefreshControl } from 'react-native-gesture-handler'
import { StackNavigationProp } from '@react-navigation/stack'
import { SharedElement } from 'react-navigation-shared-element'
import { Avatar, Badge, Chip, IconButton } from 'react-native-paper'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Icons from '@/icons'
import { material } from '@/utils/icon'
import Section from '@/components/Section'
import SearchBar from '@/components/SearchBar'
import { useI18n } from '@/contexts/PreferencesContext'
import { Border, Color, FontFamily, FontSize } from 'globals'
import { Event, useStoreActions, useStoreState } from '@/store'

interface ScreenProps {
	navigation: StackNavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width, height } = Dimensions.get('window')

const colors = {
	'public': Color.primary,
	'friends': Color.success,
	'unlisted': Color.black
}

export default function Category({ navigation, route }: ScreenProps) {
	const { __ } = useI18n()
	const [search, setSearch] = useState('')
	const [filters, setFilters] = useState([
		{ name: 'all', icon: 'account-group', selected: true, onPress: (_: object) => console.log(_) },
		{ name: route.params._.name, icon: 'tag', selected: true, predicate: (_: Event<true>) => _.category?.name === route.params._.name },
		// { name: 'trending', icon: 'trending-up', selected: false },
		// { name: 'nearby', icon: 'map-marker', selected: false },
		{ name: 'free', icon: 'currency-usd', selected: false, predicate: (_: Event<true>) => _.place && _.place.price === 0 },
	])
	const bottomTabBarHeight = useBottomTabBarHeight()
	const [refreshing, setRefreshing] = useState(false)
	const setFirstVisits = useStoreActions(({ utils }) => utils.setFirstVisits)

	useEffect(() => {
		// Change the header title and add a refresh button
		navigation.setOptions({
			headerTitle: route.params._.name,
			headerLeft: () => <Icons.Category style={{ marginLeft: 12 }} set="bold" size={30} primaryColor="white" />,
			// headerLeft: () => <IconButton icon={material('vector-square')} iconColor={Color.white} onPress={onRefresh} />,
			headerRight: () => <IconButton icon="refresh" iconColor={Color.white} onPress={onRefresh} />
		})

		setFirstVisits({ category: false })
	}, [])

	const onRefresh = useCallback(() => {
		setRefreshing(true)
		setTimeout(() => setRefreshing(false), 2000)
	}, [])

	return (
		<SafeAreaView style={[styles.screen, { height: height - bottomTabBarHeight }]}>
			<ScrollView
				style={styles.content}
				keyboardDismissMode="interactive"
				keyboardShouldPersistTaps="handled"
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			>
				<View>
					<SearchBar value={search} onChangeText={setSearch} />

					<ScrollView contentContainerStyle={styles.chips} horizontal showsHorizontalScrollIndicator={false}>
						{filters.map((_, i) => (
							<Chip
								key={i}
								style={[styles.chip, _.selected && { backgroundColor: Color.primary }]}
								icon={_.icon}
								children={_.name}
								selected={_.selected}
								textStyle={styles.typo}
								selectedColor={_.selected ? Color.white : Color.body}
								closeIcon={(_.selected ? 'minus' : 'plus') + '-circle'}
								// onClose={() => setFilters({ ...filters, [i]: { ..._, selected: !_.selected } })}
								onPress={() => _?.onPress ? _.onPress(_) : setFilters([...filters.slice(0, i), { ..._, selected: !_.selected }, ...filters.slice(i + 1)])}
							/>
						))}
					</ScrollView>

					<Section
						path="events"
						refreshing={refreshing}
						predicate={(_: Event<true>[]) =>
							// Test all predicates of selected filters
							_.filter(_ => filters.filter(f => f.selected).every(f => f.predicate ? f.predicate(_) : true))
							// _.filter(_ => _.category?.name === route.params._.name)
							.sort((a, b) => a.visibility > b.visibility ? 1 : -1)
						}
						vertical
					>
						{(items, styles) => items.map((_: Event<true>) => (
							<TouchableOpacity key={_.id} style={styles.block} onPress={() => navigation.navigate('ExploreStack', { screen: 'Event', params: { _ } })}>
								<Image style={styles.image} resizeMode="cover" source={{ uri: _.uri || 'https://fakeimg.pl/260/5f60b9/FFF/?text=No%20Image&font=lobster&font_size=50' }} />
								{_.category?.name && <Badge style={styles.category}>{_.category?.name}</Badge>}

								<View style={styles.container}>
									<Badge style={[styles.badge, { backgroundColor: colors[_.visibility] }]} size={25}>
										{Number(_.attendees?.length ?? 0) + ' / ' + (_.limit ? _.limit : '∞')}
									</Badge>

									<View style={styles.row}>
										<Text style={[styles.text, styles.typo, { color: Color.body }]}>
											{_.start.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
											{_.end.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) !== _.start.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) && ' • ' + _.end.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
										</Text>
									</View>

									<Text style={[styles.text, styles.typo]}>{_.title}</Text>

									<View style={styles.row}>
										<Avatar.Image size={20} source={{ uri: _.owner?.uri || 'https://picsum.photos/seed/picsum/200/300' }} />
										<Text style={[styles.text, styles.typo, { color: Color.body }]}>{_.owner?.username ?? '@eventify'}</Text>
									</View>
								</View>
							</TouchableOpacity>
						))}
					</Section>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Color.white
	},
	content: {
		gap: 32,
		padding: 20
	},
	typo: {
		// textAlign: 'center',
		textTransform: 'capitalize',
		fontFamily: FontFamily.medium
	},
	title: {
		fontSize: FontSize.x2l
	},
	subtitle: {
		color: Color.body,
		fontSize: FontSize.sm
	},
	chips: {
		gap: 16,
		marginTop: 16,
	},
	chip: {
		height: 36,
		borderRadius: 20,
		backgroundColor: Color.background
	},
	block: {
		flexGrow: 1,
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: Border.xs,
		flexDirection: 'column',
		borderColor: Color.border,
		width: (width - 20 * 3) / 2,
		height: (width - 20 * 3) / 2,
		backgroundColor: Color.white
	},
	image: {
		height: '50%',
		alignItems: 'center',
		justifyContent: 'center',
		borderTopLeftRadius: Border.xs,
		borderTopRightRadius: Border.xs,
		backgroundColor: Color.ghostwhite
	},
	category: {
		top: 10,
		left: 10,
		color: Color.primary,
		position: 'absolute',
		paddingHorizontal: 10,
		fontSize: FontSize.x2s,
		textTransform: 'uppercase',
		backgroundColor: Color.white,
		fontFamily: FontFamily.semiBold
	},
	container: {
		flex: 1,
		// paddingHorizontal: 10,
		justifyContent: 'center'
	},
	badge: {
		top: -15,
		right: 10,
		height: 'auto',
		borderWidth: 3,
		color: Color.white,
		position: 'absolute',
		paddingHorizontal: 10,
		fontSize: FontSize.xs,
		borderRadius: Border.base,
		borderColor: Color.white,
		textTransform: 'uppercase',
		backgroundColor: Color.primary,
		fontFamily: FontFamily.semiBold
	},
	row: {
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	text: {
		color: Color.heading,
		fontSize: FontSize.xs,
		paddingHorizontal: 10,
		textTransform: 'capitalize',
		fontFamily: FontFamily.medium
	}
})