import Constants from 'expo-constants'
import { NavigationProp } from '@react-navigation/native'
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'

import { useI18n } from '@/contexts/PreferencesContext'
import { Color, FontFamily, FontSize } from 'globals'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width } = Dimensions.get('screen')

export default (props: ScreenProps) => {
	const { __ } = useI18n()

	return (
		<SafeAreaView style={styles.screen}>
			<View style={styles.header}>
				<Text style={[styles.title, styles.typo]}>{__('onboarding.0.title', { title: Constants.manifest.name })}</Text>
				<Text style={[styles.subtitle, styles.typo]}>{__('onboarding.0.subtitle')}</Text>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Color.white
	},
	header: {
		gap: 16,
		height: 150,
		justifyContent: 'center'
	},
	typo: {
		fontWeight: '500',
		textAlign: 'center',
		fontFamily: FontFamily.medium
	},
	title: {
		fontSize: FontSize.x2l,
		textTransform: 'capitalize'
	},
	subtitle: {
		color: Color.body,
		fontSize: FontSize.sm
	}
})