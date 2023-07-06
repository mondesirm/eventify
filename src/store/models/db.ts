import { faker } from '@faker-js/faker'
import { Thunk, thunk } from 'easy-peasy'
import { DocumentData, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where, writeBatch, Timestamp } from 'firebase/firestore'

import { firestore } from '@/utils/firebase'
import { Category, Event, Place, StoreModel } from '@/store'

type AllPayload = string | string[]
type GetPayload = AllPayload
type SetPayload = { path: AllPayload, data: any }
type QueryPayload = { path: AllPayload, limit?: number }
type WherePayload = { path: AllPayload, where: Parameters<typeof where> }
type BatchPayload = { path: AllPayload, data: any[] }

export interface DBModel {
	init: Thunk<this, never, any, StoreModel, void>
	all: Thunk<this, AllPayload, any, StoreModel, Promise<DocumentData[]>>
	get: Thunk<this, GetPayload, any, StoreModel, ReturnType<typeof getDoc<DocumentData>>>
	set: Thunk<this, SetPayload, any, StoreModel, ReturnType<typeof setDoc<DocumentData>>>
	query: Thunk<this, QueryPayload, any, StoreModel, Promise<DocumentData[]>>
	batch: Thunk<this, BatchPayload, any, StoreModel, Promise<DocumentData[]>>
}

const { date, lorem, number } = faker

const categories: Category[] = [
	{ name: 'Parties', icon: 'party-popper' },
	{ name: 'Hangouts', icon: 'account-group' },
	{ name: 'Family', icon: 'account-child' },
	{ name: 'Dancing', icon: 'dance-ballroom' },
	{ name: 'Breathers', icon: 'nature-people' },
	{ name: 'Mature', icon: 'dance-pole' },
	{ name: 'Fun', icon: 'emoticon-happy' },
	{ name: 'Food', icon: 'food' },
	{ name: 'Culture', icon: 'palette' },
	{ name: 'Nature', icon: 'pine-tree' },
	{ name: 'Sport', icon: 'soccer' },
	{ name: 'Work', icon: 'briefcase' },
	{ name: 'Study', icon: 'school' },
	{ name: 'Health', icon: 'heart' },
	{ name: 'Friends', icon: 'account-multiple' },
	{ name: 'Love', icon: 'heart-pulse' },
	{ name: 'Other', icon: 'dots-horizontal' }
]

const places: Place[] = [
	{ name: 'Beach', uri: 'https://loremflickr.com/640/480/beach', price: 30, rating: 5, category: 'Parties' },
	{ name: 'Bowling', uri: 'https://loremflickr.com/640/480/bowling', price: 10, rating: 5, category: 'Hangouts' },
	{ name: 'Park', uri: 'https://loremflickr.com/640/480/park', price: 0, rating: 5, category: 'Family' },
	{ name: 'Nightclub', uri: 'https://loremflickr.com/640/480/nightclub', price: 20, rating: 5, category: 'Dancing' },
	{ name: 'Garden', uri: 'https://loremflickr.com/640/480/garden', price: 0, rating: 5, category: 'Breathers' },
	{ name: 'Afterparty', uri: 'https://loremflickr.com/640/480/afterparty', price: 40, rating: 5, category: 'Mature' }
]

const titles = [
	'Café', 'Dinner', 'Lunch', 'Breakfast', 'Brunch', 'Cocktail', 'Drinks', 'Beer',
	'Beach', 'Hiking', 'Skiing', 'Surfing', 'Kayaking', 'Cycling', 'Sailing', 'Diving',
	'Museum', 'Theater', 'Cinema', 'Park', 'Garden', 'Sightseeing', 'Monument', 'Church'
]

const events: Event[] = Array.from({ length: 48 }, () => {
	const start = Timestamp.fromDate(date.soon({ days: 30 }))

	return {
		title: titles[number.int(titles.length - 1)],
		description: lorem.paragraph(),
		start, end: Timestamp.fromDate(new Date(start.toDate().getTime() + Math.random() * 24 * 60 * 60 * 1000)),
		limit: Math.random() > .5 ? number.int({ min: 2, max: 10}) : null,
		visibility: ['public', 'friends', 'unlisted'][number.int(2)] as Event['visibility'],
		owner: 'malikmondesir@gmail.com',
		place: Math.random() > .5 ? places[number.int(places.length - 1)].name : null,
		category: Math.random() > .5 ? categories[number.int(categories.length - 1)].name : null,
		// attendees: [],
		// invitations: []
	}
})

export default {
	init: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		// Store categories
		getStoreActions().db.batch({ path: 'categories', data: categories }).then((categories: Category[]) => {
			// Store places and link them to categories
			getStoreActions().db.batch({ path: 'places', data: places.map(_ => ({ ..._, category: categories.find(c => c.name === _.category) ?? null })) }).then((places: Place[]) => {
				// Store events and link them to places and categories
				getStoreActions().db.batch({ path: 'events', data: events.map(_ => ({ ..._, place: places.find(p => p.name === _.place) ?? null, category: categories.find(c => c.name === _.category) ?? null })) })
			})
			// const categories = docs.map(doc => ({ ...doc.data(), path: doc.ref.path } as Category & { path: string }))
			// getStoreActions().db.batch({ path: 'places', data: places.map(p => ({ ...p, category: categories.find(c => c.name === p.category).path })) })
		})
	}),
	all: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		return getDocs(
			collection(firestore, typeof payload === 'string' ? payload : payload.join('/')
		)).then(({ docs }) => docs.map(d => ({ ...d.data(), id: d.id })))
	}),
	get: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		return getDoc(doc(firestore, typeof payload === 'string' ? payload : payload.join('/')))
	}),
	set: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		const { path, data } = payload
		return setDoc(doc(collection(firestore, typeof path === 'string' ? path : path.join('/'))), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true })
	}),
	query: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		const { path, limit: l } = payload

		return getDocs(query(
			collection(firestore, typeof path === 'string' ? path : path.join('/')),
			l ? limit(l) : null
		)).then(({ docs }) => docs.map(d => ({ ...d.data(), id: d.id })))
	}),
	batch: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		const { path, data } = payload
		const batch = writeBatch(firestore)

		if (path === undefined) console.error('No path provided for batch')

		data.forEach(item => batch.set(doc(collection(firestore, typeof path === 'string' ? path : path.join('/'))), { ...item, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true }))
		batch.commit()

		return getStoreActions().db.all(path)
	})
} as DBModel