import Constants from 'expo-constants'
import { NavigationProp } from '@react-navigation/native'
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'

import { useI18n } from '@/contexts/PreferencesContext'
import { Color, FontFamily, FontSize } from 'globals'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width } = Dimensions.get('window')

export default function Blank(props: ScreenProps) {
	const { __ } = useI18n()

	return (
		<SafeAreaView style={styles.screen}>
			<View style={styles.header}>
				<Text style={[styles.title, styles.typo]}>{__('wip.title')}</Text>
				<Text style={[styles.subtitle, styles.typo]}>{__('wip.subtitle')}</Text>
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