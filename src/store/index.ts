import { createStore, createTypedHooks } from 'easy-peasy'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import models from './models'
import { DBModel } from './models/db'
import { AuthModel } from './models/auth'
import { UserModel } from './models/user'
import { UtilsModel } from './models/utils'
import { CalendarModel } from './models/calendar'
import { Timestamp } from 'firebase/firestore'

export type StoreModel = {
	db: DBModel
	auth: AuthModel
	user: UserModel
	utils: UtilsModel
	calendar: CalendarModel
}

const typedHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedHooks.useStoreActions
export const useStoreDispatch = typedHooks.useStoreDispatch
export const useStoreState = typedHooks.useStoreState

export default createStore<StoreModel>(models)

// type Timestamp = { seconds: number, nanoseconds: number }
type Base = { id?: string, createdAt?: Timestamp, updatedAt?: Timestamp }

export type Category = {
	name: string
	icon: keyof typeof MaterialCommunityIcons.glyphMap
} & Base

// If T is true then the relation is serialized
export type Place<T = false> = {
	name: string
	uri: string
	price: number
	rating: number
	category: T extends false ? string : Category
} & Base

export type Event<T = false> = {
	title: string
	description?: string
	start: Timestamp
	end?: Timestamp
	limit?: number
	visibility: 'public' | 'friends' | 'unlisted'
	owner: T extends false ? string : User
	place?: T extends false ? string : Place
	category?: T extends false ? string : Category
	attendees?: T extends false ? string[] : User[]
	invitations?: T extends false ? string[] : Invitation[]
} & Base

export type Days = Record<string, Event[]>

export type User<T = false> = {
	avatar?: string
	username: string
	email: string
	phone?: string
	password?: string
	isDisabled: boolean
	roles: ('user' | 'admin')[]
	ownedEvents: T extends false ? string[] : Event[]
	attendedEvents: T extends false ? string[] : Event[]
	sentInvitations: T extends false ? string[] : Invitation[]
	receivedInvitations: T extends false ? string[] : Invitation[]
	trips: T extends false ? string[] : Trip[]
} & Base

export type Invitation<T = false> = {
	kind: 'friend_request' | 'event_attendance'
	event: T extends false ? string : Event
	sender: T extends false ? string : User
	receiver: T extends false ? string : User
} & Base

export type Trip<T = false> = {
	day: Timestamp
	positions: T extends false ? string[] : Position[]
	user: T extends false ? string : User
} & Base

export type Position<T = false> = {
	coordinates: { latitude: number, longitude: number, [key: string]: any }
	trip: T extends false ? string : Trip
} & Base