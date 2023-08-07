import * as Location from 'expo-location'
import { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'
import { NavigationProp } from '@react-navigation/native'
import { Dimensions, Text, StyleSheet, View } from 'react-native'
import MapView, { Geojson, Marker, PROVIDER_GOOGLE } from 'react-native-maps'

import { User, useStoreState } from '@/store'
import { FontFamily, FontSize, Color } from 'globals'
import { useI18n } from '@/contexts/PreferencesContext'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

type LocationObject = Location.LocationObject & { latitudeDelta: number, longitudeDelta: number }

const { width, height } = Dimensions.get('window');

const ratio = width / height
const latitudeDelta = 0.0922
const longitudeDelta = latitudeDelta * ratio

export default function Places({ navigation, route }: ScreenProps) {
	const { __ } = useI18n()
	const [region, setRegion] = useState(null)
	const [location, setLocation] = useState(null)
	const [errorMsg, setErrorMsg] = useState(null)
	const currentUser = useStoreState(({ user }) => user?.currentUser)

	const geojson: GeoJSON.FeatureCollection = {
		type: 'FeatureCollection',
		features: [
			// {
			// 	type: 'Feature',
			// 	properties: {},
			// 	geometry: {
			// 		type: 'MultiLineString',
			// 		coordinates: currentUser?.trips?.map(_ => _.positions.map(_ => [_.coordinates.longitude, _.coordinates.latitude]))
			// 	}
			// },
			{
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'LineString',
					coordinates: currentUser?.trips?.map(_ => _.positions.map(_ => [_.coordinates.longitude, _.coordinates.latitude]))[0]
				}
			},
			{
				type: 'Feature',
				properties: {},
				geometry: {
					type: 'MultiPoint',
					coordinates: currentUser?.trips?.map(_ => _.positions.map(_ => [_.coordinates.longitude, _.coordinates.latitude]))[0]
				}
			}
		]
	}

	useEffect(() => {
		Location.requestForegroundPermissionsAsync().then(({ status }) => {
			if (status !== 'granted') return Toast.show({ type: 'error', text1: __('grant.location'), text2: __('grant.subtitle') })
			return Location.getCurrentPositionAsync().then(l => setLocation({ ...l.coords, latitudeDelta, longitudeDelta }))
		})
		// .catch((error) => setErrorMsg(error.message))
	}, [])

	return (
		<View style={styles.screen}>
			<MapView
				style={styles.screen}
				initialRegion={location}
				provider={PROVIDER_GOOGLE}
				onRegionChange={setRegion}
			>
				<Marker coordinate={location} title="Me" description="My location" />

				<Geojson geojson={geojson} color={Color.primary} strokeColor={Color.black} fillColor="green" strokeWidth={2} />
			</MapView>
		</View>
	)
}

const styles = StyleSheet.create({
	screen: {
		...StyleSheet.absoluteFillObject
	}
})