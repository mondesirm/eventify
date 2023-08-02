import { createStore, createTypedHooks } from 'easy-peasy'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore'

import models from './models'
import { DBModel } from './models/db'
import { AuthModel } from './models/auth'
import { UserModel } from './models/user'
import { UtilsModel } from './models/utils'
import { CalendarModel } from './models/calendar'

export type StoreModel = {
	db: DBModel
	auth: AuthModel
	user: UserModel
	utils: UtilsModel
	calendar: CalendarModel
}

const typedHooks = createTypedHooks<StoreModel>()

export const useStoreState = typedHooks.useStoreState
export const useStoreActions = typedHooks.useStoreActions
export const useStoreDispatch = typedHooks.useStoreDispatch

export default createStore<StoreModel>(models)

export type Base = { id?: string, ref?: DocumentReference, createdAt?: Timestamp, updatedAt?: Timestamp }
export type Rating<T = false> = { value: number, user: T extends false ? string : User<T> } & Base
export type Content<T = false> = { uri?: string, description?: string, ratings?: Rating<T>[] } & Base

export type Category = {
	name: string
	icon: keyof typeof MaterialCommunityIcons.glyphMap
} & Content

// If T is true then the relation is serialized
export type Place<T = false> = {
	name: string
	price?: number
	category: T extends false ? string : Category
} & Content

export type Event<T = false> = {
	title: string
	start: Timestamp
	end?: Timestamp
	limit?: number
	visibility: 'public' | 'friends' | 'unlisted'
	owner?: T extends false ? string : User
	place?: T extends false ? string : Place<T>
	category?: T extends false ? string : Category
	attendees?: string[]
	invitations?: Invitation[]
} & Content

export type Days = Record<string, Event[]>

export type User<T = false> = {
	email: string
	phone?: string
	username: string
	password?: string
	isDisabled: boolean
	roles: ('user' | 'admin')[]
	trips?: T extends false ? string[] : Trip[]
	ownedEvents?: T extends false ? string[] : Event[]
	attendedEvents?: T extends false ? string[] : Event[]
	sentInvitations?: T extends false ? string[] : Invitation[]
	receivedInvitations?: T extends false ? string[] : Invitation[]
} & Content

export type Invitation<T = false> = {
	kind: 'event_attendance' | 'event_invite' | 'friend_request' | 'message_request'
	event: T extends false ? string : Event
	sender: T extends false ? string : User
	receiver: T extends false ? string : User
} & Base

export type Trip<T = false> = {
	day: Timestamp
	positions?: Position[]
	user: T extends false ? string : User
} & Base

export type Position = {
	coordinates: GeoPoint
	// coordinates: Record<'latitude' | 'longitude', number>
	// trip: T extends false ? string : Trip
} & Base