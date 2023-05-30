import { useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'

import Routes from '@/navigation/Routes'
import { useStoreActions } from '@/store'

export default () => {
	const { restoreSession, setNetInfoState } = useStoreActions(actions => ({
		restoreSession: actions.auth.restoreSession,
		setNetInfoState: actions.utils.setNetInfoState
	}))

	useEffect(() => {
		// Subscribe to network state changes
		const unsubscribe = NetInfo.addEventListener(setNetInfoState)
		return () => unsubscribe()
	}, [])

	restoreSession()
		.then(() => { console.log('Logged in.') })
		.catch(() => { console.log('Not logged in.') })

	return <Routes />
}