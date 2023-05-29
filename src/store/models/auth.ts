import _ from 'lodash'
import * as Haptics from 'expo-haptics'
import { Thunk, thunk } from 'easy-peasy'
import * as WebBrowser from 'expo-web-browser'
import { FirebaseError } from '@firebase/util'
import * as Google from 'expo-auth-session/providers/google'
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'

import { FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, TwitterAuthProvider, createUserWithEmailAndPassword, getIdTokenResult, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithCredential, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, useDeviceLanguage } from 'firebase/auth'

import { StoreModel } from '@/store'
import { AllowedScope } from '@/locales'
import { auth, firestore } from '@/utils/firebase'
import user from './user'
import { err } from 'react-native-svg/lib/typescript/xml'

type LoginPayload = {
	email: string
	password: string
	remember?: boolean
}

type ProviderPayload = {
	data: string
	social: keyof typeof providers | 'phone'
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
	logout: Thunk<this, never, any, StoreModel>
	provider: Thunk<this, ProviderPayload, any, StoreModel, Promise<AllowedScope[]>>
	getUserInfo: Thunk<this, string, any, StoreModel, Promise<AllowedScope[]>>
	register: Thunk<this, RegisterPayload, any, StoreModel, Promise<AllowedScope[]>>
	resetPassword: Thunk<this, string, any, StoreModel, Promise<AllowedScope[]>>
	restoreSession: Thunk<this, never, any, StoreModel, Promise<string>>
}

// export type Providers = Record<string, { provider: InstanceType<typeof FacebookAuthProvider | typeof PhoneAuthProvider>; scopes: string[] }>

const providers = {
	facebook: {
		provider: new FacebookAuthProvider(),
		scopes: ['public_profile', 'email']
	},
	github: {
		provider: new GithubAuthProvider(),
		scopes: ['read:user']
	},
	google: {
		provider: new GoogleAuthProvider(),
		scopes: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
	},
	twitter: {
		provider: new TwitterAuthProvider(),
		scopes: []
	}	
}

export default {
	login: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		getStoreActions().user.setLoading(true)

		const { email, password, remember } = payload
		const isConnected = getStoreState().utils.netInfoState.isConnected

		return new Promise((resolve, reject) => {
			signInWithEmailAndPassword(auth, email, password).then(({ user }) => {
				if (!user.emailVerified) return reject(['login.error', 'login.verify'])

				// Get user role and token if email is verified
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
	provider: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		// getStoreActions().user.setLoading(true)

		const { data, social } = payload
		const isConnected = getStoreState().utils.netInfoState.isConnected

		return new Promise((resolve, reject) => {
			// Get provider data
			// const { provider, scopes } = providers[social]
			const provider = new GoogleAuthProvider()

			// useDeviceLanguage(auth)
			// auth.languageCode = 'es'

			// Sign in with provider
			signInWithPopup(auth, provider).then(userCredential => {
				if (!userCredential.user.emailVerified) return reject(['login.error', 'login.verify'])

				const credential = GoogleAuthProvider.credentialFromResult(userCredential)

				console.log(credential)

				signInWithCredential(auth, credential).then(({ user }) => {
					// Get user role and token if email is verified
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
			})
			.catch(e => {
				console.log(e)
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

				if (!isConnected) reject(['login.error', 'errors.connection'])
				reject(['login.error', 'errors.' + e.code])
			})
			// .finally(() => getStoreActions().user.setLoading(false))
		})
	}),
	getUserInfo: thunk((actions, payload, { getStoreActions, getStoreState }) => {
		getStoreActions().user.setLoading(true)

		const isConnected = getStoreState().utils.netInfoState.isConnected

		return new Promise((resolve, reject) => {
			fetch('https://www.googleapis.com/userinfo/v2/me', { headers: { Authorization: `Bearer ${payload}` } }).then(res => res.json()).then(user => {
				getStoreActions().user.setLogin({ role: 'user', token: payload })
				getStoreActions().user.setUser(user)
				// console.log(user)
				resolve(['login.success.0', 'login.success.1'])
			})
			.catch(err => {
				console.log(err)
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

				if (!isConnected) reject(['login.error', 'errors.connection'])
				reject(['login.error', 'errors.' + err.code])
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

		const isConnected = getStoreState().utils.netInfoState.isConnected

		return new Promise((resolve, reject) => {
			sendPasswordResetEmail(auth, payload).then(() => {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

				resolve(['reset.success.0', 'reset.success.1'])
			})
			.catch(({ code }: FirebaseError) => {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

				if (!isConnected) reject(['reset.error', 'errors.connection'])
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