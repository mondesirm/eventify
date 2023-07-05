import { faker } from '@faker-js/faker'
import * as Haptics from 'expo-haptics'
import { FirebaseError } from '@firebase/util'
import { DateData } from 'react-native-calendars'
import { ActionOn, actionOn, Thunk, thunk } from 'easy-peasy'

import { Days, Event, StoreModel } from '@/store'

export interface CalendarModel {
	items: Days
	loading: boolean
	loadItems: Thunk<this, DateData, any, StoreModel, Promise<void>>
	onLoadItems: ActionOn<this, StoreModel>
}

export default {
	items: {},
	loading: false,
	loadItems: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		const { month } = payload
		const isConnected = getStoreState().utils.netInfoState?.isConnected

		return new Promise((resolve, reject) => {
			getStoreActions().db.query({ path: 'events' }).then((events: Event[]) => {
				const eventsForMonth = events.filter(_ => _.start.toDate().getMonth() + 1 === month)
				const uniqueDays = [...new Set(eventsForMonth.map(_ => _.start.toDate().toISOString().split('T')[0]))]
				const eventsPerDay: Days = {}

				for (const day of uniqueDays) {
					// TODO Redo event filtering by day
					//! Sometimes there are misplaced events, for whatever reason
					eventsPerDay[day] = eventsForMonth.filter(_ => _.start.toDate().toISOString().split('T')[0] === day)
				}

				getStoreState().calendar.items = eventsPerDay
				resolve()
			})
			.catch(({ code }: FirebaseError) => {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

				if (!isConnected) reject(['calendar.error', 'errors.connection'])
				reject(['calendar.error', 'errors.' + code])
			})
		})
	}),
	onLoadItems: actionOn(actions => actions.loadItems, state => {
		const items: Days = {}

		// Sort items by time whenever they are loaded
		Object.keys(state.items).forEach(key => {
			// items[key] = state.items[key].sort((a, b) => a.start.getTime() - b.start.getTime())
			items[key] = state.items[key].sort((a, b) => {
				const aTime = { start: a.start.toMillis(), end: a.end.toMillis() }
				const bTime = { start: b.start.toMillis(), end: b.end.toMillis() }

				// Sort by start time and if they are the same, sort by end time
				return aTime.start - bTime.start || aTime.end - bTime.end
			})
		})

		state.items = items
	})
} as CalendarModel