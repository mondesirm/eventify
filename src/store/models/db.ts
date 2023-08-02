import { faker } from '@faker-js/faker'
import * as Haptics from 'expo-haptics'
import { Thunk, thunk } from 'easy-peasy'
import { FirebaseError } from '@firebase/util'
import { DocumentData, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where, writeBatch, Timestamp, GeoPoint, DocumentReference, SetOptions } from 'firebase/firestore'

import { firestore } from '@/utils/firebase'
import { Category, Content, Event, Place, StoreModel, User } from '@/store'

type AllPayload = string | string[]
type GetPayload = AllPayload
type SetPayload = { path: AllPayload, data: any, options?: SetOptions }
type QueryPayload = { path: AllPayload, limit?: number }
type WherePayload = { path: AllPayload, where: Parameters<typeof where> }
type BatchPayload = { path: AllPayload, data: any[], options?: SetOptions }

export interface DBModel {
	storage: Record<string, object[]>
	init: Thunk<this, never, any, StoreModel, Promise<any>>
	all: Thunk<this, AllPayload, any, StoreModel, Promise<DocumentData[]>>
	get: Thunk<this, GetPayload, any, StoreModel, ReturnType<typeof getDoc<DocumentData>>>
	set: Thunk<this, SetPayload, any, StoreModel, ReturnType<typeof setDoc<DocumentData>>>
	query: Thunk<this, QueryPayload, any, StoreModel, Promise<DocumentData[]>>
	batch: Thunk<this, BatchPayload, any, StoreModel, Promise<DocumentData[]>>
}

const { date, helpers, location, lorem, number, phone, internet } = faker

const content = (label: string, users: User<boolean>[]): Content => ({
	description: lorem.paragraph(),
	uri: `https://loremflickr.com/640/480/${label}`,
	ratings: helpers.arrayElements(users.map(_ => ({
		value: number.int(5),
		user: _.id ?? _.email
	})), number.int(users.length))
})

const admin: User<true> = {
	uri: 'https://loremflickr.com/640/480/person',
	username: 'eventify',
	email: 'admin@eventify.com',
	phone: phone.number(),
	isDisabled: false,
	roles: ['user', 'admin'],
	trips: Array.from({ length: number.int({ min: 1, max: 5 }) }, () => ({
		day: Timestamp.fromDate(date.recent({ days: 30 })),
		positions: Array.from({ length: number.int({ min: 5, max: 20 }) }, () => ({
			coordinates: new GeoPoint(...location.nearbyGPSCoordinate({ origin: [48.85341, 2.3488] }))
		})),
		user: 'admin@eventify.com'
	}))
}

const users = Array.from({ length: 20 }, (): User<true> => {
	const email = internet.email()

	return {
		uri: helpers.maybe(() => 'https://loremflickr.com/640/480/person') ?? null,
		username: internet.userName(),
		email,
		phone: helpers.maybe(() => phone.number()) ?? null,
		isDisabled: Math.random() > .5,
		roles: ['user'],
		// ownedEvents: [],
		// attendedEvents: events.filter(_ => Math.random() > .5).map(_ => _.title),
		// invitedEvents: events.filter(_ => Math.random() > .5).map(_ => _.title),
		// receivedInvitations: events.filter(_ => Math.random() > .5).map(_ => _.title),
		trips: Array.from({ length: number.int({ min: 1, max: 5 }) }, () => ({
			day: Timestamp.fromDate(date.recent({ days: 30 })),
			positions: Array.from({ length: number.int({ min: 5, max: 20 }) }, () => ({
				coordinates: new GeoPoint(...location.nearbyGPSCoordinate({ origin: [48.85341, 2.3488] }))
			})),
			user: email
		}))
	}
})

const categories: Category[] = [
	{ name: 'Breathers', icon: 'nature-people' },
	{ name: 'Culture', icon: 'palette' },
	{ name: 'Dancing', icon: 'dance-ballroom' },
	{ name: 'Family', icon: 'account-child' },
	{ name: 'Food', icon: 'food' },
	{ name: 'Friends', icon: 'account-multiple' },
	{ name: 'Fun', icon: 'emoticon-happy' },
	{ name: 'Hangouts', icon: 'account-group' },
	{ name: 'Health', icon: 'heart' },
	{ name: 'Love', icon: 'heart-pulse' },
	{ name: 'Mature', icon: 'dance-pole' },
	{ name: 'Nature', icon: 'pine-tree' },
	{ name: 'Parties', icon: 'party-popper' },
	{ name: 'Sport', icon: 'soccer' },
	{ name: 'Study', icon: 'school' },
	{ name: 'Work', icon: 'briefcase' },
	{ name: 'Other', icon: 'dots-horizontal' }
]

const titles = [
	'Café', 'Dinner', 'Lunch', 'Breakfast', 'Brunch', 'Cocktail', 'Drinks', 'Beer',
	'Beach', 'Hiking', 'Skiing', 'Surfing', 'Kayaking', 'Cycling', 'Sailing', 'Diving',
	'Museum', 'Theater', 'Cinema', 'Park', 'Garden', 'Sightseeing', 'Monument', 'Church'
]

const places: Place[] = [
	{ name: 'Beach', category: 'Parties' },
	{ name: 'Bowling', category: 'Hangouts' },
	{ name: 'Park', category: 'Family' },
	{ name: 'Nightclub', category: 'Dancing' },
	{ name: 'Garden', category: 'Breathers' },
	{ name: 'Afterparty', category: 'Mature' },
	{ name: 'Restaurant', category: 'Food' },
	{ name: 'Cinema', category: 'Culture' },
	{ name: 'Museum', category: 'Culture' },
	{ name: 'Theater', category: 'Culture' },
	{ name: 'Sightseeing', category: 'Culture' }
]

const events = (users: User<true>[], places: Place<true>[]) => Array.from({ length: 48 }, (): Event<true> => {
	const title = helpers.arrayElement(titles)
	const start = Timestamp.fromDate(date.soon({ days: 30 }))
	const limit = helpers.maybe(() => number.int({ min: 2, max: 10 })) ?? null
	// TODO include 0 in randomization
	const attendees = helpers.maybe(() => helpers.arrayElements(users, { min: 1, max: limit || users.length }).map(_ => _.id)) ?? []

	return {
		...content(title, users),
		title,
		start, end: Timestamp.fromDate(new Date(start.toDate().getTime() + Math.random() * 24 * 60 * 60 * 1000)),
		limit,
		visibility: helpers.arrayElement(['public', 'friends', 'unlisted']),
		place: helpers.maybe(() => helpers.arrayElement(places)) ?? null,
		category: helpers.maybe(() => helpers.arrayElement(categories)) ?? null,
		attendees,
		invitations: attendees.length === 0 ? [] : helpers.arrayElements(users.filter(_ => !attendees.includes(_.id))).map(_ => ({
			kind: 'event_attendance',
			event: title,
			sender: helpers.arrayElement(attendees),
			receiver: _.id
		}))
	}
})

export default {
	storage: { categories: [], events: [], places: [], users: [] },
	init: thunk((actions, payload, { getStoreActions }) => {
		// const userRef: DocumentReference = doc(firestore, 'users', 'EuJzgIuj5FecDDMgij0Tqj0M8dd2')

		// TODO use DocumentReference, subcollections, where, orderBy and collectionGroup queries
		return new Promise((resolve, reject) => {
			// Uncomment this line to promote an existing user to admin
			getStoreActions().db.set({ path: 'users/EuJzgIuj5FecDDMgij0Tqj0M8dd2', data: admin })

			// Store users
			getStoreActions().db.batch({ path: 'users', data: users.map(_ => ({ ..._, ...content('person', users) })) }).then((users: User<true>[]) => {
				// Store categories
				getStoreActions().db.batch({ path: 'categories', data: categories.map(_ => ({ ..._, ...content(_.name, users) })) }).then((categories: Category[]) => {
					// Store places
					getStoreActions().db.batch({ path: 'places', data: places.map(_ => ({ ..._, ...content(_.name, users), price: helpers.maybe(() => number.float({ max: 100, precision: 0.5 })) ?? null, category: categories.find(c => c.name === _.category) ?? null })) }).then((places: Place<true>[]) => {
						// Store events
						getStoreActions().db.batch({ path: 'events', data: events(users, places).map(_ => ({ ..._, ...content(_.title, users), owner: admin })) })
					})
				})
			})
		})
	}),
	all: thunk(async (actions, payload, { getState }) => {
		const { docs } = await getDocs(collection(firestore, typeof payload === 'string' ? payload : payload.join('/')))

		// Cache data and return it
		const data = docs.map(_ => ({ ..._.data(), id: _.id, ref: _.ref }))
		getState().storage = { ...getState().storage, [typeof payload === 'string' ? payload : payload.join('/')]: data }
		return data
	}),
	get: thunk((actions, payload) => {
		return getDoc(doc(firestore, typeof payload === 'string' ? payload : payload.join('/')))
	}),
	set: thunk((actions, { path, data, options = { merge: true } }) => {
		return setDoc(
			doc(firestore, typeof path === 'string' ? path : path.join('/')),
			{ createdAt: serverTimestamp(), ...data, updatedAt: serverTimestamp() },
			options
		)
	}),
	query: thunk((actions, { path, limit: l }) => {
		return getDocs(query(
			collection(firestore, typeof path === 'string' ? path : path.join('/')),
			l ? limit(l) : null
		)).then(({ docs }) => docs.map(d => ({ ...d.data(), id: d.id })))
	}),
	batch: thunk((actions, { path, data, options = { merge: true } }, { getState, getStoreActions }) => {
		const batch = writeBatch(firestore)

		data.forEach(item => batch.set(
			doc(collection(firestore, typeof path === 'string' ? path : path.join('/'))),
			{ createdAt: serverTimestamp(), ...item, updatedAt: serverTimestamp() }, { merge: true })),
			options
		batch.commit()

		return getStoreActions().db.all(path)
	})
} as DBModel