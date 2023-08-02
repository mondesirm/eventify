import { useEffect } from 'react'
import Toast from 'react-native-toast-message'
import NetInfo from '@react-native-community/netinfo'

import Routes from '@/navigation/Routes'
import { AllowedScope } from '@/locales'
import AuthStack from '@/navigation/Auth.Stack'
import MainStack from '@/navigation/Main.Stack'
import { useI18n } from '@/contexts/PreferencesContext'
import { useStoreActions, useStoreState } from '@/store'
import OnboardingStack from '@/navigation/Onboarding.Stack'

export default function NavigationProvider() {
	const { __ } = useI18n()
	const roles = useStoreState(({ user }) => user?.roles)
	const firstTime = Object.values(useStoreState(({ utils }) => utils.firstVisits)).every(_ => _ !== false)

	const { init, restoreSession, setNetInfoState } = useStoreActions(_ => ({
		init: _.db.init,
		restoreSession: _.auth.restoreSession,
		setNetInfoState: _.utils.setNetInfoState
	}))

	// init() //? Uncomment to create fixtures

	useEffect(() => {
		// Subscribe to network state changes
		const unsubscribe = NetInfo.addEventListener(setNetInfoState)
		return () => unsubscribe()
	}, [])

	useEffect(() => {
		// Restore session if roles are empty
		if (roles?.length === 0) restoreSession().catch((err: AllowedScope[]) => Toast.show({ type: 'error', text1: __(err[0]), text2: __(err[1]) }))
		}, [roles])

	return <Routes roles={roles} firstTime={firstTime} />
}