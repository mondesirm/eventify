import _ from 'lodash'
import * as Haptics from 'expo-haptics'
import { Thunk, thunk } from 'easy-peasy'
import { FirebaseError } from '@firebase/util'
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, getIdTokenResult, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'

import { StoreModel } from '@/store'
import { AllowedScope } from '@/locales'
import { auth, firestore } from '@/utils/firebase'

type LoginPayload = {
	email: string
	password: string
	remember?: boolean
}

type RegisterPayload = {
	avatar: string
	username: string
	phone: string
	email: string
	password: string
	confirm: string
}

export interface AuthModel {
	login: Thunk<this, LoginPayload, any, StoreModel, Promise<AllowedScope[]>>
	logout: Thunk<this, never, any, StoreModel, Promise<AllowedScope[]>>
	register: Thunk<this, RegisterPayload, any, StoreModel, Promise<AllowedScope[]>>
	resetPassword: Thunk<this, string, any, StoreModel, Promise<AllowedScope[]>>
	restoreSession: Thunk<this, never, any, StoreModel, Promise<string>>
}

export default {
	login: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		getStoreActions().user.setLoading(true)

		const { email, password, remember } = payload
		const isConnected = getStoreState().utils.netInfoState.isConnected

		return new Promise((resolve, reject) => {
			signInWithEmailAndPassword(auth, email, password).then(({ user }) => {
				if (!user.emailVerified) return reject(['login.error', 'login.verify'])

				// If verification link was opened, get user roles and token
				getIdTokenResult(user).then(({ token }) => {
					// Get Firestore user document
					getDoc(doc(firestore, 'users', user.uid)).then(doc => {
						const currentUser = doc.data()

						getStoreActions().user.setLogin({ roles: currentUser?.roles, token })
						if (currentUser?.roles.includes('admin')) getStoreActions().user.setIsAdmin(true)

						getStoreActions().user.setUser(currentUser)

						Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
						resolve(['login.success.0', 'login.success.1'])
					})
				})
			})
			.catch(({ code }: FirebaseError) => {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

				if (!isConnected) reject(['login.error', 'errors.connection'])
				reject(['login.error', 'errors.' + code])
			})
			.finally(() => getStoreActions().user.setLoading(false))
		})
	}),
	logout: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		getStoreActions().user.setLoading(true)

		const isConnected = getStoreState().utils.netInfoState.isConnected

		return new Promise((resolve, reject) => {
			signOut(auth).then(() => {
				getStoreActions().user.setLogout()

				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
				resolve(['logout.success.0', 'logout.success.1'])
			})
			.catch(({ code }: FirebaseError) => {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

				if (!isConnected) reject(['logout.error', 'errors.connection'])
				reject(['logout.error', 'errors.' + code])
			})
			.finally(() => getStoreActions().user.setLoading(false))
		})
	}),
	register: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		getStoreActions().user.setLoading(true)

		const { avatar, username, phone, email, password } = payload
		const isConnected = getStoreState().utils.netInfoState.isConnected

		return new Promise((resolve, reject) => {
			// Create user in Firebase Auth
			createUserWithEmailAndPassword(auth, email, password).then(({ user }) => {
				// Upload avatar to Firebase Storage
				getStoreActions().user.upload({ uri: avatar, name: user.uid + '.png', dir: 'avatars' }).then(photoURL => {
					// Update displayName and photoURL (avatar)
					updateProfile(user, { displayName: username, photoURL }).then(() => {
						// Send email verification
						sendEmailVerification(user).then(() => {
							// Create a document in Firestore with user data
							setDoc(doc(collection(firestore, 'users'), user.uid), {
								phone,
								username,
								roles: ['user'],
								// isOnline: true,
								isDisabled: false,
								email: user.email,
								avatar: user.photoURL,
								createdAt: serverTimestamp(),
								updatedAt: serverTimestamp()
							})
							.then(() => {
								signOut(auth) // Force logout user
								// TODO Disable user account with Firebase Admin SDK
								Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

								resolve(['register.success.0', 'register.success.1'])
							})
						})
					})
				})
				// .catch(err => { reject(['register.error', 'errors.unknown']) })
			})
			.catch(err => console.log(err))
			// .catch(({ code }: FirebaseError) => {
			// 	Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

			// 	if (!isConnected) reject(['register.error', 'errors.connection'])
			// 	reject(['register.error', 'errors.' + code])
			// })
			.finally(() => getStoreActions().user.setLoading(false))
		})
	}),
	resetPassword: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		getStoreActions().user.setLoading(true)

		const isConnected = getStoreState().utils.netInfoState.isConnected

		return new Promise((resolve, reject) => {
			sendPasswordResetEmail(auth, payload).then(() => {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
				resolve(['reset.success.0', 'reset.success.1'])
			})
			.catch(({ code }: FirebaseError) => {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

				if (!isConnected) reject(['login.error', 'errors.connection'])
				reject(['reset.error', 'errors.' + code])
			})
			.finally(() => getStoreActions().user.setLoading(false))
		})
	}),
	restoreSession: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		getStoreActions().user.setLoading(true)

		return new Promise((resolve, reject) => {
			onAuthStateChanged(auth, user => {
				if (user === null/*  || getStoreState().user?.roles?.length === 0 */) return getStoreActions().user.setLoading(false) /* reject('You are not logged in.') */
				if (user.emailVerified !== true) return getStoreActions().user.setLoading(false) /* reject('You are not verified.') */

				user.getIdTokenResult().then(({ token }) => {
					// Get current user data
					getDoc(doc(collection(firestore, 'users'), user.uid)).then(doc => {
						const currentUser = doc.data()
						// console.log('uid', user.uid)
						// console.log('user', user?.email)
						// console.log('currentUser', currentUser?.email)

						getStoreActions().user.setLogin({ roles: currentUser?.roles, token })
						if (currentUser?.roles.includes('Admin')) getStoreActions().user.setIsAdmin(true)

						getStoreActions().user.setUser(currentUser)
						resolve(user.email)
					})
				})
				.catch((err: string) => reject(err))
				.finally(() => getStoreActions().user.setLoading(false))
			})
		})
	})
} as AuthModel