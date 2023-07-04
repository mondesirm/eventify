import Constants from 'expo-constants'
import { useEffect, useState } from 'react'
import { Chip, IconButton } from 'react-native-paper'
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'

import SearchBar from '@/components/SearchBar'
import { Color, FontFamily, FontSize } from 'globals'
import { useI18n } from '@/contexts/PreferencesContext'
import { StackNavigationProp } from '@react-navigation/stack'

interface ScreenProps {
	navigation: StackNavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width } = Dimensions.get('screen')

export default function Category({ navigation, route }: ScreenProps) {
	const { __ } = useI18n()
	const [search, setSearch] = useState('')

	useEffect(() => {
		navigation.setOptions({
			// Set the header title
			headerTitle: route.params._.name,
			// Add a refresh button
			headerRight: () => <IconButton icon="refresh" iconColor={Color.white} />
		})
	}, [])

	return (
		<SafeAreaView style={styles.screen}>
			<ScrollView style={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" stickyHeaderIndices={[0]}>
				<View>
					{/* <Text style={[styles.title, styles.typo]}>{__('onboarding.0.title', { title: Constants.manifest.name })}</Text>
					<Text style={[styles.subtitle, styles.typo]}>{__('onboarding.0.subtitle')}</Text> */}
					<SearchBar value={search} onBlur={() => setSearch('')} onChangeText={setSearch} />

					<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
						{/* Chip list */}
						{['All', 'Popular', 'New', 'Trending'].map((_, i) => (
							<Chip key={i} style={styles.chip} selectedColor={Color.primary} onPress={() => setSearch(_)} selected={search === _}>{_}</Chip>
						))}
					</ScrollView>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Color.white
	},
	content: {
		gap: 32,
		padding: 20
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
	},
	chips: {
		gap: 16,
		marginTop: 16,
	},
	chip: {
		height: 36,
		borderRadius: 20,
		// color: Color.white,
		backgroundColor: Color.background
	}
})