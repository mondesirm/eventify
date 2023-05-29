import { createStore, createTypedHooks } from 'easy-peasy'

import models from './models'
import { AuthModel } from './models/auth'
import { UserModel } from './models/user'
import { UtilsModel } from './models/utils'

export type StoreModel = {
	auth: AuthModel
	user: UserModel
	utils: UtilsModel
}

const typedHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedHooks.useStoreActions
export const useStoreDispatch = typedHooks.useStoreDispatch
export const useStoreState = typedHooks.useStoreState

export default createStore<StoreModel>(models)