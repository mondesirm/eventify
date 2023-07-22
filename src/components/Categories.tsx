import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { StackNavigationProp } from '@react-navigation/stack'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native'

import { Category, useStoreActions } from '@/store'
import { Border, Color, FontFamily, FontSize } from 'globals'
import { SharedElement } from 'react-navigation-shared-element'

interface SectionProps extends ViewProps {
	limit?: number
	refreshing?: boolean
}

const { width, height } = Dimensions.get('window')

export default function Categories({ limit = null, refreshing = false, ...rest }: SectionProps) {
	const query = useStoreActions(({ db }) => db.query)
	const [categories, setCategories] = useState<Category[]>([])
	const { navigate } = useNavigation<StackNavigationProp<any, any>>()

	useEffect(() => { query({ path: 'categories', limit }).then(docs => setCategories(docs as Category[])) }, [limit, refreshing])

	return (
		<View style={styles.section} {...rest}>
			<View style={styles.header}>
				<Text style={[styles.title, styles.typo]}>Trending Categories</Text>

				<TouchableOpacity onPress={() => navigate('Categories')}>
					<Text style={[styles.more, styles.typo]}>View All</Text>
				</TouchableOpacity>
			</View>

			<SharedElement id="categories" style={styles.content}>
				{categories.map(({ name, icon }, i) => (
					<TouchableOpacity key={i} style={styles.block} onPress={() => navigate('Category', { name })}>
						<View style={styles.image}>
							<Icon name={icon} size={38} />
						</View>

						<View style={styles.container}>
							<Text style={[styles.text, styles.typo]}>{name}</Text>
						</View>
					</TouchableOpacity>
				))}

				{categories.length === 0 && (
					<View style={styles.container}>
						<Text style={[styles.text, styles.typo]}>No categories found</Text>
					</View>
				)}
			</SharedElement>
		</View>
	)
}

const styles = StyleSheet.create({
	section: {
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	typo: {
		textTransform: 'capitalize',
		fontFamily: FontFamily.medium
	},
	title: {
		color: Color.heading,
		fontSize: FontSize.lg
	},
	more: {
		color: Color.body
	},
	content: {
		gap: 20,
		marginTop: 16,
		flexWrap: 'wrap',
		flexDirection: 'row'
	},
	block: {
		flexGrow: 1,
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: Border.xs,
		borderColor: Color.border,
		width: (width - 20 * 4) / 3 - 1,
		height: (width - 20 * 4) / 3 - 1
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
		fontSize: FontSize.xs
	}
})