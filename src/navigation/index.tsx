import { useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'

import Routes from '@/navigation/Routes'
import AuthStack from '@/navigation/Auth.Stack'
import MainStack from '@/navigation/Main.Stack'
import { useStoreActions, useStoreState } from '@/store'
import OnboardingStack from '@/navigation/Onboarding.Stack'

export default function NavigationProvider() {
	const roles = useStoreState(({ user }) => user?.roles)
	const firstTime = Object.values(useStoreState(({ utils }) => utils.firstVisits)).every(_ => _ !== false)

	const { restoreSession, setNetInfoState } = useStoreActions(_ => ({
		restoreSession: _.auth.restoreSession,
		setNetInfoState: _.utils.setNetInfoState
	}))

	useEffect(() => {
		// Subscribe to network state changes
		const unsubscribe = NetInfo.addEventListener(setNetInfoState)
		return () => unsubscribe()
	}, [])

	useEffect(() => {
		// Restore session if roles are empty
		if (roles?.length === 0) restoreSession()
	}, [roles])

	return <Routes roles={roles} firstTime={firstTime} />
}