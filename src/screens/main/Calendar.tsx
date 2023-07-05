import Toast from 'react-native-toast-message'
import { AnimatedFAB, Badge } from 'react-native-paper'
import { NavigationProp } from '@react-navigation/native'
import { Agenda, DateData } from 'react-native-calendars'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native'

import { AllowedScope } from '@/locales'
import { Color, FontFamily, FontSize } from 'globals'
import { useI18n } from '@/contexts/PreferencesContext'
import { Event, useStoreActions, useStoreState } from '@/store'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width, height } = Dimensions.get('screen')

export default function Calendar({ navigation, route }: ScreenProps) {
	const { __, locale } = useI18n()
	const bottomTabBarHeight = useBottomTabBarHeight()
	const items = useStoreState(({ calendar }) => calendar.items) as any
	const loadItems = useStoreActions(({ calendar }) => calendar.loadItems)

	// Random color based on category name
	const randomColor = (name: string | null = null) => {
		if (!name) return 'transparent'
		return `#${((parseInt(name, 36) * 2) % 0xffffff).toString(16)}000000`.slice(0, 7)
	}

	const rowHasChanged: typeof Agenda.prototype.props.rowHasChanged = (r1, r2) => r1.name !== r2.name

	const renderEmptyDate: typeof Agenda.prototype.props.renderEmptyDate = () => (
		<View style={styles.emptyDate}>
			<Text>Nothing there!</Text>
		</View>
	)

	const renderItem = (item: any) => {
		let event = item as Event<true>

		return (
			<View style={styles.item}>
				<View>
					<Text style={{ color: '#48506B', fontFamily: FontFamily.medium, marginBottom: 10 }}>{event.title}</Text>
					<Text style={{ color: '#9B9B9B', fontFamily: FontFamily.medium }}>
						{event.start.toDate().toLocaleDateString(locale, { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
						{event?.end && !event.start.isEqual(event.end) && ' • ' + event.end.toDate().toLocaleDateString(locale, { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
					</Text>
				</View>

				<Badge style={[styles.badge, { backgroundColor: randomColor(event.category?.name) }]}>{event.category?.name}</Badge>
			</View>
		)
	}

	const loadItemsForMonth = (data: DateData) => {
		loadItems(data)
			// .then((res: AllowedScope[]) => {
			// 	Toast.show({ text1: __(res[0]), text2: __(res[1]) })
			// 	navigation.navigate('Login', { email })
			// })
			.catch((err: AllowedScope[]) => Toast.show({ type: 'error', text1: __(err[0]), text2: __(err[1]) }))
	}

	return (
		<SafeAreaView style={[styles.screen, { height: height - bottomTabBarHeight }]}>
			<Agenda
				// style={{ paddingBottom: 20 }}
				firstDay={1}
				items={items}
				enableSwipeMonths
				renderItem={renderItem}
				rowHasChanged={rowHasChanged}
				loadItemsForMonth={loadItemsForMonth}
				renderEmptyDate={renderEmptyDate}
				theme={{
					dotColor: Color.primary,
					backgroundColor: '#F1F1F8',
					agendaTodayColor: '#4F44B6',
					agendaDayNumColor: Color.primary,
					agendaDayTextColor: Color.primary,
					selectedDayBackgroundColor: Color.primary
				}}
			/>

			<AnimatedFAB style={styles.fab} extended icon="plus" label="Add Item" onPress={() => {}} />
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
		bottom: 0,
		right: 0,
		margin: 16,
		borderRadius: 28,
		// position: 'absolute',
		backgroundColor: Color.white
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Color.white // no whiteTwo?
	},
	item: {
		padding: 10,
		marginTop: 10,
		marginRight: 10,
		borderRadius: 5,
		flexDirection: 'row',
		backgroundColor: 'white',
		justifyContent: 'space-between'
	},
	badge: {
		color: Color.white,
		paddingHorizontal: 10,
		fontSize: FontSize.x2s,
		textTransform: 'uppercase',
		backgroundColor: Color.primary,
		fontFamily: FontFamily.semiBold
	},
	emptyDate: {
		flex: 1,
		height: 15,
		paddingTop: 30
	}
})