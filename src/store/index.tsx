import { createStore, createTypedHooks } from 'easy-peasy'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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

export const useStoreActions = typedHooks.useStoreActions
export const useStoreDispatch = typedHooks.useStoreDispatch
export const useStoreState = typedHooks.useStoreState

export default createStore<StoreModel>(models)

type Timestamp = { seconds: number, nanoseconds: number }
type Base = { id?: string, createdAt?: Timestamp, updatedAt?: Timestamp }

export type Category = {
	name: string
	icon: keyof typeof MaterialCommunityIcons.glyphMap
} & Base

export type Place<T = false> = {
	name: string
	uri: string
	price: number
	rating: number
	category: T extends false ? string : Category
} & Base

export type Item = { name: string, time: `${number}:${number}`, labels: { name: string, color: string }[] }
export type Days = Record<string, Item[]>

export type Event = {
	name: string
	place: Place
	start: Date
	end: Date
} & Base