import { useEffect, useState } from 'react'
// import Spinner from 'react-native-loading-spinner-overlay'
import { ActivityIndicator, MD3Colors } from 'react-native-paper'


export default function Loading() {
	const [loading, setLoading] = useState(true)

	//! Set loading to false after 1s
	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false)
		}, 1000)
		return () => clearTimeout(timer)
	}, [])

	return (
		// <Spinner
		// 	visible={loading}
		// 	textContent='Chargement...'
		// 	textStyle={{ color: '#fff' }}
		// 	animation='fade'
		// />
		<ActivityIndicator animating={loading} color={MD3Colors.primary100} />
	)
}