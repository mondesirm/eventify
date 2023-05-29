import { initializeApp } from '@firebase/app'
import { connectStorageEmulator, getStorage } from 'firebase/storage'
import { connectDatabaseEmulator, getDatabase } from 'firebase/database'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
// import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { connectAuthEmulator, getAuth, GoogleAuthProvider, PhoneAuthProvider } from 'firebase/auth'
import { API_KEY, AUTH_DOMAIN, DATABASE_URL, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } from '@env'
// 
const config = {
	apiKey: API_KEY,
	authDomain: AUTH_DOMAIN,
	databaseURL: DATABASE_URL,
	projectId: PROJECT_ID,
	storageBucket: STORAGE_BUCKET,
	messagingSenderId: MESSAGING_SENDER_ID,
	appId: APP_ID,
	measurementId: MEASUREMENT_ID
}

// const camelCase = (str: string) => str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())

// Map env variables like so: camelCase(key) => env[key]
// const config = Object.keys(env).reduce((acc, key) => {
// 	acc[camelCase(key)] = env[key]
// 	return acc
// }, {})

// Firebase app
export const app = initializeApp(config)

// Firebase services (https://firebase.google.com/docs/web/setup#available-libraries)
export const auth = getAuth(app)
export const storage = getStorage(app)
export const database = getDatabase(app)
export const firestore = getFirestore(app)

// Export all methods
// export default {
// 	app: await import('firebase/app'),
// 	auth: await import('firebase/auth'),
// 	storage: await import('firebase/storage'),
// 	database: await import('firebase/database'),
// 	firestore: await import('firebase/firestore')
// }

export const googleProvider = new GoogleAuthProvider()
export const phoneProvider = new PhoneAuthProvider(auth)

const ENV_DEV_EMULATOR = false

// Emulators (https://firebase.google.com/docs/emulator-suite)
if (ENV_DEV_EMULATOR) {
	connectAuthEmulator(getAuth(), 'http://localhost:9099')
	connectStorageEmulator(getStorage(), 'localhost', 9199)
	connectDatabaseEmulator(getDatabase(), 'localhost', 9090)
	connectFirestoreEmulator(getFirestore(), 'localhost', 8080)
}