import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native'

import { useStoreActions, useStoreState } from '@/store'
import { Border, Color, FontFamily, FontSize } from 'globals'

// interface SectionProps extends ViewProps {
interface SectionProps {
    path: string
    limit?: number
	vertical?: boolean
	refreshing?: boolean
	predicate?: (_: any[]) => any[]
	children: (_: any, stylesheet: typeof styles) => JSX.Element
}

const { width } = Dimensions.get('window')

export default function Section({ path, limit = null, vertical = false, refreshing = false, predicate = _ => _, children }: SectionProps) {
	const query = useStoreActions(({ db }) => db.query)
	const storage = useStoreState(({ db }) => db.storage)
	const [items, setItems] = useState(storage[path] || [])
	const { navigate } = useNavigation<StackNavigationProp<any, any>>()

	useEffect(() => { query({ path, limit }).then(docs => setItems(docs)) }, [limit, refreshing])

	return (
		<View style={[styles.section, vertical && { backgroundColor: 'transparent' }]}>
			{!vertical && <View style={styles.header}>
				<Text style={[styles.title, styles.typo]}>Trending {path.charAt(0).toUpperCase() + path.slice(1)}</Text>

				<TouchableOpacity onPress={() => navigate('ExploreStack', { screen: path.charAt(0).toUpperCase() + path.slice(1) })}>
					<Text style={[styles.more, styles.typo]}>View All</Text>
				</TouchableOpacity>
			</View>}

			{predicate(items).length === 0 ?
				<View style={[styles.content, vertical && { marginTop: 0 }]}>
					<Text style={[styles.text, styles.typo]}>No {path} found</Text>
				</View> :
				<ScrollView contentContainerStyle={[styles.content, vertical && { marginTop: 0 }]} horizontal={!vertical} showsHorizontalScrollIndicator={false} decelerationRate="fast" snapToInterval={styles.block.width + 20}>
					{children(predicate(items), styles)}
				</ScrollView>
			}
		</View>
	)
}

const styles = StyleSheet.create({
	section: {
		paddingVertical: 20,
		marginHorizontal: -20,
        backgroundColor: Color.ghostwhite
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 20,
		justifyContent: 'space-between'
	},
	typo: {
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
		alignSelf: 'center',
		flexDirection: 'row',
		paddingHorizontal: 20
	},
	block: {
		flexGrow: 1,
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: Border.xs,
		flexDirection: 'column',
		borderColor: Color.border,
		width: (width - 20 * 3) / 2,
		height: (width - 20 * 3) / 2,
		backgroundColor: Color.white
	},
	image: {
		height: '50%',
		alignItems: 'center',
		justifyContent: 'center',
		borderTopLeftRadius: Border.xs,
		borderTopRightRadius: Border.xs,
		backgroundColor: Color.ghostwhite
	},
	category: {
		top: 10,
		left: 10,
		color: Color.primary,
		position: 'absolute',
		paddingHorizontal: 10,
		fontSize: FontSize.x2s,
		textTransform: 'uppercase',
		backgroundColor: Color.white,
		fontFamily: FontFamily.semiBold
	},
	container: {
		flex: 1,
		justifyContent: 'center'
	},
	badge: {
		top: -15,
		right: 10,
		height: 'auto',
		borderWidth: 3,
		color: Color.white,
		position: 'absolute',
		paddingHorizontal: 10,
		fontSize: FontSize.xs,
		borderRadius: Border.base,
		borderColor: Color.white,
		textTransform: 'uppercase',
		backgroundColor: Color.primary,
		fontFamily: FontFamily.semiBold
	},
	row: {
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	text: {
		color: Color.heading,
		fontSize: FontSize.xs,
		paddingHorizontal: 10,
		fontFamily: FontFamily.medium
	}
})