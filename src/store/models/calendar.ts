import { Action, Thunk, action, thunk, ActionOn, actionOn } from 'easy-peasy'
import { DocumentData, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where, writeBatch } from 'firebase/firestore'

import { Days, Item, StoreModel } from '@/store'
import { firestore } from '@/utils/firebase'

export interface CalendarModel {
	items: Days
	loading: boolean
	// load: Action<CalendarModel, Item[]>
	loadItems: Action<this, any>
	onLoadItems: ActionOn<this, StoreModel>
}

const names = [
	'Café', 'Dinner', 'Lunch', 'Breakfast', 'Brunch', 'Cocktail', 'Drinks', 'Beer',
	'Beach', 'Hiking', 'Skiing', 'Surfing', 'Kayaking', 'Cycling', 'Sailing', 'Diving',
	'Museum', 'Theater', 'Cinema', 'Park', 'Garden', 'Sightseeing', 'Monument', 'Church'
]

const labels = ['Fun', 'Food', 'Culture', 'Nature', 'Sport', 'Relax', 'Party', 'Work', 'Study', 'Health', 'Family', 'Friends', 'Love', 'Other']
	.map((name, i) => ({ name, color: `hsl(${i * 360 / names.length}, 100%, 50%)` }))

const items: Item[] = Array.from({ length: 48 }, () => ({
	name: names[Math.floor(Math.random() * names.length)],
	time: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 2) * 30}`,
	labels: Math.random() > .5 ? [labels[Math.floor(Math.random() * labels.length)]] : []
}))

const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export default {
	items: {},
	loading: false,
	loadItems: action((state, payload) => {
		if (Object.keys(state.items).length > 0) return
		// if (Object.keys(state.items).length > 0) state.items = {}

		const items: Days = {}

		for (let i = -15; i < 15; i += 1) {
			const time = payload.timestamp + i * 24 * 60 * 60 * 1000
			const strTime = new Date(time).toISOString().split('T')[0]

			if (!items[strTime]) {
				items[strTime] = []
				const numItems = randomNumber(0, 5)

				for (let j = 0; j < numItems; j += 1) {
					items[strTime].push({
						name: names[randomNumber(0, names.length - 1)],
						time: `${randomNumber(0, 24)}:${randomNumber(0, 60)}`,
						labels: Math.random() > .5 ? [labels[randomNumber(0, Object.keys(labels).length - 1)]] : [],
					})
				}
			}
		}

		const newItems: Days = {}
		Object.keys(items).forEach(key => {
			newItems[key] = items[key]
		})

		state.items = newItems
		state.loading = false
	}),
	onLoadItems: actionOn(actions => actions.loadItems, state => {
		const items: Days = {}

		// Sort items by time whenever they are loaded
		Object.keys(state.items).forEach(key => {
			items[key] = state.items[key].sort((a, b) => {
				const aTime = a.time.split(':').map(n => parseInt(n))
				const bTime = b.time.split(':').map(n => parseInt(n))

				if (aTime[0] < bTime[0]) return -1
				if (aTime[0] > bTime[0]) return 1
				if (aTime[1] < bTime[1]) return -1
				if (aTime[1] > bTime[1]) return 1
				return 0
			})
		})

		state.items = items
	})
} as CalendarModel