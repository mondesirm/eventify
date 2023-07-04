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

const titles = [
	'Café', 'Dinner', 'Lunch', 'Breakfast', 'Brunch', 'Cocktail', 'Drinks', 'Beer',
	'Beach', 'Hiking', 'Skiing', 'Surfing', 'Kayaking', 'Cycling', 'Sailing', 'Diving',
	'Museum', 'Theater', 'Cinema', 'Park', 'Garden', 'Sightseeing', 'Monument', 'Church'
]

const labels = ['Fun', 'Food', 'Culture', 'Nature', 'Sport', 'Relax', 'Party', 'Work', 'Study', 'Health', 'Family', 'Friends', 'Love', 'Other']
	.map((name, i) => ({ name, color: `hsl(${i * 360 / titles.length}, 100%, 50%)` }))

const items: Item[] = Array.from({ length: 48 }, () => ({
	title: titles[Math.floor(Math.random() * titles.length)],
	description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	start: new Date(Math.random() * 24 * 60 * 60 * 1000),
	end: new Date(Math.random() * 24 * 60 * 60 * 1000),
	limit: Math.random() > .5 ? Math.floor(Math.random() * 10) : undefined,
	visibility: ['public', 'friends', 'unlisted'][Math.floor(Math.random() * 3)] as Item['visibility'],
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
						title: titles[randomNumber(0, titles.length - 1)],
						description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
						start: new Date(time + 60 * 60 * 1000 * randomNumber(0, 23)),
						end: new Date(time + 60 * 60 * 1000 * randomNumber(0, 23)),
						limit: Math.random() > .5 ? randomNumber(0, 10) : undefined,
						visibility: ['public', 'friends', 'unlisted'][randomNumber(0, 2)] as Item['visibility'],
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
			// items[key] = state.items[key].sort((a, b) => a.start.getTime() - b.start.getTime())
			items[key] = state.items[key].sort((a, b) => {
				const aTime = { start: a.start.getTime(), end: a.end.getTime() }
				const bTime = { start: b.start.getTime(), end: b.end.getTime() }

				// Sort by start time and if they are the same, sort by end time
				return aTime.start - bTime.start || aTime.end - bTime.end
			})
		})

		state.items = items
	})
} as CalendarModel