import * as Haptics from 'expo-haptics'
import { FirebaseError } from '@firebase/util'
import { DocumentData } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Action, action, Computed, computed, thunk, Thunk } from 'easy-peasy'

import { StoreModel } from '@/store'
import uriToBlob from '@/utils/uriToBlob'
import { storage } from '@/utils/firebase'

type User = DocumentData | {
	uid: string
	avatar: string
	username: string
	email: string
	phone: string
	role: string
	createdAt: any
	updatedAt: any
}

type UploadPayload = {
	uri: string
	name: string
	dir?: string
}

export interface UserModel {
	currentUser: User
	role: string
	token: string
	roleAdmin: string
	loading: boolean
	isLoggedIn: Computed<this, boolean>
	allUsers: []
	setUser: Action<this, User>
	setRole: Action<this, string>
	setRoleAdmin: Action<this, string>
	setLoading: Action<this, boolean>
	setLogin: Action<this, { role: string, token: string }>
	setLogout: Action<this>
	upload: Thunk<this, UploadPayload, any, StoreModel, Promise<string>>
}

export default {
	currentUser: null,
	role: null,
	token: null,
	roleAdmin: null,
	loading: true,
	isLoggedIn: computed((state) => state.role != null),
	allUsers: [],
	setUser: action((state, payload) => { state.currentUser = payload }),
	setRole: action((state, payload) => { state.role = payload }),
	setRoleAdmin: action((state, payload) => { state.roleAdmin = payload }),
	setLoading: action((state, payload) => { state.loading = payload }),
	setLogin: action((state, payload) => {
		state.role = payload.role
		state.token = payload.token
	}),
	setLogout: action(state => {
		state.currentUser = null
		state.role = null
		state.token = null
		state.allUsers = null
	}),
	upload: thunk(async (actions, payload, { getStoreActions, getStoreState }) => {
		getStoreActions().user.setLoading(true)

		const { uri, name, dir = 'avatars' } = payload
		const isConnected = getStoreState().utils.netInfoState.isConnected

		return new Promise((resolve, reject) => {
			// Convert URI to Blob
			uriToBlob(uri).then(blob => {
				const path = ref(storage, `${dir}/${name}.png`)

				// Upload file to Firebase Storage and return public URL
				uploadBytes(path, blob).then(({ ref }) => {
					Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

					// Free up memory (actually we make the blob available for garbage collection so it can be freed up)
					const uri = URL.createObjectURL(blob)
					URL.revokeObjectURL(uri)
					resolve(getDownloadURL(ref))
				})
			})
			.catch(({ code }: FirebaseError) => {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

				if (!isConnected) reject(['register.error', 'errors.connection'])
				reject(['register.error', 'errors.' + code])
			})
			.finally(() => getStoreActions().user.setLoading(false))
		})
	})
} as UserModel