import { Agenda } from 'react-native-calendars'
import { AnimatedFAB, Badge } from 'react-native-paper'
import { NavigationProp } from '@react-navigation/native'
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

import { Color, FontFamily, FontSize } from 'globals'
import { Item, useStoreActions, useStoreState } from '@/store'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width, height } = Dimensions.get('screen')

export default function Calendar({ navigation, route }: ScreenProps) {
	const bottomTabBarHeight = useBottomTabBarHeight()
	const items = useStoreState(({ calendar }) => calendar.items) as any
	const loadItems = useStoreActions(({ calendar }) => calendar.loadItems)

	const rowHasChanged: typeof Agenda.prototype.props.rowHasChanged = (r1, r2) => r1.name !== r2.name

	const renderEmptyDate: typeof Agenda.prototype.props.renderEmptyDate = () => (
		<View style={styles.emptyDate}>
			<Text>Nothing there!</Text>
		</View>
	)

	const renderItem = (item: any) => {
		let event = item as Item
		const labels = event.labels.map((_, i) => <Badge key={i} style={[styles.badge, { backgroundColor: _.color }]}>{_.name}</Badge>)

		return (
			<View style={styles.item}>
				<View>
					<Text style={{ color: '#48506B', fontFamily: FontFamily.medium, marginBottom: 10 }}>{event.title}</Text>
					<Text style={{ color: '#9B9B9B', fontFamily: FontFamily.medium }}>
						{event.start.toLocaleDateString('en', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
						{event?.end && event.start !== event.end && ' • ' + event.end.toLocaleDateString('en', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
					</Text>
				</View>

				<View /* style="horizontal h-start" */>{labels}</View>
			</View>
		)
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
				loadItemsForMonth={loadItems}
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