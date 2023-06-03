import { Agenda } from 'react-native-calendars'
import { NavigationProp } from '@react-navigation/native'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

import { Item, useStoreActions, useStoreState } from '@/store'
import { Color, FontFamily, FontSize } from 'globals'
import { AnimatedFAB, Badge } from 'react-native-paper'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

export default function Calendar({ navigation, route }: ScreenProps) {
	const items = useStoreState(({ calendar }) => calendar.items) as any
	const loadItems = useStoreActions(({ calendar }) => calendar.loadItems)
	// console.log(items)

	const rowHasChanged: typeof Agenda.prototype.props.rowHasChanged = (r1, r2) => r1.name !== r2.name

	const renderEmptyDate: typeof Agenda.prototype.props.renderEmptyDate = () => (
		<View style={styles.emptyDate}>
			<Text>Nothing there!</Text>
		</View>
	)

	const renderItem = (item: any) => {
		const labels = item.labels.map((_, i) => <Badge key={i} style={[styles.badge, { backgroundColor: _.color }]}>{_.name}</Badge>)

		return (
			<View style={styles.item}>
				<View>
					<Text style={{ color: '#48506B', fontFamily: FontFamily.medium, marginBottom: 10 }}>{item.name}</Text>
					<Text style={{ color: '#9B9B9B', fontFamily: FontFamily.medium }}>{item.time}</Text>
				</View>

				<View /* style="horizontal h-start" */>{labels}</View>
			</View>
		)
	}

	return (
		<SafeAreaView style={styles.screen}>
			<Agenda
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