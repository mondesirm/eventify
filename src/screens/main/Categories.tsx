import { useEffect, useState } from 'react'
import { NavigationProp } from '@react-navigation/native'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { SharedElement } from 'react-navigation-shared-element'
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Category, useStoreActions } from '@/store'
import { useI18n } from '@/contexts/PreferencesContext'
import { Border, Color, FontFamily, FontSize } from 'globals'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width, height } = Dimensions.get('screen')

export default function Explore({ navigation }: ScreenProps) {
	const { __ } = useI18n()
	const all = useStoreActions(({ db }) => db.all)
	const bottomTabBarHeight = useBottomTabBarHeight()
	const [categories, setCategories] = useState<Category[]>([])

	useEffect(() => { all('categories').then(docs => setCategories(docs as Category[])) }, [])

	return (
		<SafeAreaView style={[styles.screen, { height: height - bottomTabBarHeight * 2 }]}>
			<SharedElement id="categories" style={styles.content}>
				{categories.map((_, i) => (
					<TouchableOpacity key={i} style={styles.block} onPress={() => navigation.navigate('Category', { _ })}>
						<SharedElement id={_.icon} style={styles.image}>
							<Icon name={_.icon} size={60} />
						</SharedElement>

						<SharedElement id={_.name} style={styles.container}>
							<Text style={styles.text}>{_.name}</Text>
						</SharedElement>
					</TouchableOpacity>
				))}

				{/* TODO lottie Nothing */}
				{categories.length === 0 && (
					<View style={styles.container}>
						<Text style={styles.text}>No categories found</Text>
					</View>
				)}
			</SharedElement>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Color.white
	},
	content: {
		gap: 20,
		flex: 1,
		flexWrap: 'wrap',
		alignItems: 'center',
		alignContent: 'center',
		flexDirection: 'column',
		justifyContent: 'space-evenly'
	},
	block: {
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: Border.xs,
		borderColor: Color.border,
		backgroundColor: Color.white,
		width: (width - 20 * 3) / 2,
		height: (height - 20 * 3 - 110) / 4
	},
	image: {
		height: '70%',
		alignItems: 'center',
		justifyContent: 'center',
		borderTopLeftRadius: Border.xs,
		borderTopRightRadius: Border.xs,
		backgroundColor: Color.ghostwhite
	},
	container: {
		flex: 1,
		justifyContent: 'center'
	},
	text: {
		textAlign: 'center',
		color: Color.heading,
		fontSize: FontSize.base,
		textTransform: 'capitalize',
		fontFamily: FontFamily.medium
	}
})