import { createStore, createTypedHooks } from 'easy-peasy'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import models from './models'
import { DBModel } from './models/db'
import { AuthModel } from './models/auth'
import { UserModel } from './models/user'
import { UtilsModel } from './models/utils'

export type StoreModel = {
	db: DBModel
	auth: AuthModel
	user: UserModel
	utils: UtilsModel
}

type Timestamp = { seconds: number, nanoseconds: number }
type Timestamps = { createdAt?: Timestamp, updatedAt?: Timestamp }

export type Category = {
	name: string
	icon: keyof typeof MaterialCommunityIcons.glyphMap
} & Timestamps

export type Place<T = false> = {
	name: string
	uri: string
	price: number
	rating: number
	category: T extends false ? string : Category
	createdAt?: { seconds: number, nanoseconds: number }
	updatedAt?: { seconds: number, nanoseconds: number }
} & Timestamps

const typedHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedHooks.useStoreActions
export const useStoreDispatch = typedHooks.useStoreDispatch
export const useStoreState = typedHooks.useStoreState

export default createStore<StoreModel>(models)