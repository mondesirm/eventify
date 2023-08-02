import Constants from 'expo-constants'
import { useEffect, useState } from 'react'
import { NavigationProp } from '@react-navigation/native'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { SharedElement } from 'react-navigation-shared-element'
import { getDefaultHeaderHeight } from '@react-navigation/elements'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Category, useStoreActions } from '@/store'
import { useI18n } from '@/contexts/PreferencesContext'
import { Border, Color, FontFamily, FontSize } from 'globals'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width, height } = Dimensions.get('window')

export default function Explore({ navigation }: ScreenProps) {
	const { __ } = useI18n()
	const all = useStoreActions(({ db }) => db.all)
	const bottomTabBarHeight = useBottomTabBarHeight()
	const [categories, setCategories] = useState<Category[]>([])
	const defaultHeaderHeight = getDefaultHeaderHeight(Dimensions.get('window'), false, Constants.statusBarHeight)

	useEffect(() => { all('categories').then(docs => setCategories(docs as Category[])) }, [])

	return (
		<View style={[styles.screen, { height: height - bottomTabBarHeight - defaultHeaderHeight }]}>
			{/* TODO Lottie Nothing */}
			{categories.length === 0 ?
				<View style={styles.container}>
					<Text style={styles.text}>No categories found</Text>
				</View> :
				<ScrollView contentContainerStyle={styles.content} decelerationRate="fast" snapToInterval={height - bottomTabBarHeight - defaultHeaderHeight}>
					{categories.sort((a, b) => Number(a.name > b.name) ^ Number([a.name, b.name].includes('Other')) ? 1 : -1).map((_, i) => (
						<TouchableOpacity key={i} style={[styles.block, { height: (height - 20 * 6 - bottomTabBarHeight - defaultHeaderHeight) / 5 }]} onPress={() => navigation.navigate('Category', { _ })}>
							<SharedElement id={_.icon} style={styles.image}>
								<Icon name={_.icon} size={60} />
							</SharedElement>

							<SharedElement id={_.name} style={styles.container}>
								<Text style={styles.text}>{_.name}</Text>
							</SharedElement>
						</TouchableOpacity>
					))}
				</ScrollView>
			}
		</View>
	)
}

const styles = StyleSheet.create({
	screen: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Color.white
	},
	content: {
		gap: 20,
		flexWrap: 'wrap',
		paddingVertical: 20,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	block: {
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: Border.xs,
		borderColor: Color.border,
		width: (width - 20 * 4) / 3,
		backgroundColor: Color.white
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