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
		if (roles.length === 0) restoreSession()
		// const t = setTimeout(restoreSession, 5000)
		// return () => clearTimeout(t)
	}, [roles])

	return <Routes roles={roles} firstTime />
}