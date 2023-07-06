import { useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'

import Routes from '@/navigation/Routes'
import AuthStack from '@/navigation/Auth.Stack'
import MainStack from '@/navigation/Main.Stack'
import { useStoreActions, useStoreState } from '@/store'
import OnboardingStack from '@/navigation/Onboarding.Stack'

export default function NavigationProvider() {
	const firstTime = true
	const roles = useStoreState(({ user }) => user?.roles)

	const { init, restoreSession, setNetInfoState } = useStoreActions(_ => ({
		init: _.db.init,
		restoreSession: _.auth.restoreSession,
		setNetInfoState: _.utils.setNetInfoState
	}))

	useEffect(() => {
		// Subscribe to network state changes
		const unsubscribe = NetInfo.addEventListener(setNetInfoState)
		return () => unsubscribe()
	}, [])

	// init()

	useEffect(() => {
		console.log('roles', roles)
		setTimeout(() => {
			restoreSession()
				// .then(() => { console.log('Logged in.') })
				// .catch(() => { console.log('Not logged in.') })
		}, 5000)
	}, [roles])


	// if (roles?.length > 0) return <MainStack />
	// else return firstTime ? <OnboardingStack /> : <AuthStack />
	return <Routes roles={roles} firstTime />

}