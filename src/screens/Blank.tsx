import { NavigationProp } from '@react-navigation/native'
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'

import { Color, FontFamily, FontSize } from 'globals'
import { usePreferences } from '@/contexts/PreferencesContext'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width } = Dimensions.get('screen')

export default function ({ navigation, route }: ScreenProps) {
	const { i18n: { __ } } = usePreferences()

	return (
		<ScrollView style={styles.screen} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
			<View style={styles.content}>
				<Text style={[styles.title, styles.typo]}>{__('onboarding.0.title')}</Text>
				<Text style={[styles.subtitle, styles.typo]}>{__('onboarding.0.subtitle')}</Text>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	screen: {
		flex: 1
	},
	content: {
		width,
		gap: 16,
		top: '10%'
	},
	typo: {
		fontWeight: '500',
		textAlign: 'center',
		fontFamily: FontFamily.primary
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