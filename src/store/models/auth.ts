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
	login: Thunk<this, LoginPayload, any, StoreModel>
	logout: Thunk<this, never, any, StoreModel>
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

				// If verification link was opened, get user role
				getIdTokenResult(user).then(({ token }) => {
					// Get Firestore user document
					getDoc(doc(firestore, 'users', user.uid)).then(doc => {
						const currentUser = doc.data()
						getStoreActions().user.setLogin({ role: currentUser.role, token })

						if (currentUser.role === 'admin') getStoreActions().user.setRoleAdmin(currentUser.role)

						getStoreActions().user.setUser(currentUser)
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

		return new Promise((resolve, reject) => {
			signOut(auth).then(() => {
				getStoreActions().user.setLogout()
				resolve('logout.success')
			})
			.catch(() => {
				reject('logout.error')
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
							const ref = collection(firestore, 'users')
								setDoc(doc(ref, user.uid), {
									phone,
									username,
									role: 'user',
									uid: user.uid,
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
			.catch(({ code }: FirebaseError) => {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)	

				if (!isConnected) reject(['register.error', 'errors.connection'])
				reject(['register.error', 'errors.' + code])
			})
			.finally(() => getStoreActions().user.setLoading(false))
		})
	}),
	resetPassword: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		getStoreActions().user.setLoading(true)

		return new Promise((resolve, reject) => {
			sendPasswordResetEmail(auth, payload).then(() => {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

				resolve(['reset.success.0', 'reset.success.1'])
			})
			.catch(({ code }: FirebaseError) => {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

				reject(['reset.error', 'errors.' + code])
			})
			.finally(() => getStoreActions().user.setLoading(false))
		})
	}),
	restoreSession: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		getStoreActions().user.setLoading(true)

		return new Promise((resolve, reject) => {
			onAuthStateChanged(auth, user => {
				if (user != null && getStoreState().user.role == null) {
					if (user.emailVerified === true) {
						user.getIdTokenResult()
							.then(({ token }) => {
								// Récupère les données de l'utilisateur
								const ref = collection(firestore, 'users')
								getDoc(doc(ref, user.uid))
									.then(doc => {
										const currentUser = doc.data()
										getStoreActions().user.setLogin({ role: currentUser.role, token })

										if (currentUser.role == 'Admin') getStoreActions().user.setRoleAdmin(currentUser.role)

										// resolve(getStoreActions().user.setUser(userData))
										console.log('restoreSession', currentUser?.email)
										getStoreActions().user.setUser(currentUser)
										resolve(user.email)
									})
							})
							.catch(() => {
								reject()
								getStoreActions().user.setLoading(false)
							})
							.finally(() => {
								getStoreActions().user.setLoading(false)
							})
					} else {
						getStoreActions().user.setLoading(false)
						reject('Veuillez valider votre inscription en cliquant sur le lien qui vous a été envoyé par email.')
					}
				} else {
					getStoreActions().user.setLoading(false)
					reject('You are not logged in.')
				}
			})
		})
	})
} as AuthModel