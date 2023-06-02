import { useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'

import Routes from '@/navigation/Routes'
import { useStoreActions } from '@/store'

export default function NavigationProvider() {
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
	restoreSession()
		// .then(() => { console.log('Logged in.') })
		// .catch(() => { console.log('Not logged in.') })

	return <Routes />
}