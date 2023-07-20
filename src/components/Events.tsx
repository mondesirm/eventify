import { useEffect, useState } from 'react'
import { Avatar, Badge } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native'

import { Event, useStoreActions, useStoreState } from '@/store'
import { Border, Color, FontFamily, FontSize } from 'globals'

interface SectionProps extends ViewProps {
	limit?: number
	refreshing?: boolean
}

const { width } = Dimensions.get('window')

export default function Events({ limit = null, refreshing = false }: SectionProps) {
	const [items, setItems] = useState<Event<true>[]>([])
	const query = useStoreActions(({ db }) => db.query)
	const currentUser = useStoreState(({ user }) => user?.currentUser)
	const { navigate } = useNavigation<StackNavigationProp<any, any>>()

	useEffect(() => { query({ path: 'events', limit }).then(docs => setItems(docs as Event<true>[])) }, [limit, refreshing])

	return (
		<View style={styles.section}>
			<View style={styles.header}>
				<Text style={[styles.title, styles.typo]}>Trending Events</Text>

				<TouchableOpacity onPress={() => {}}>
					<Text style={[styles.more, styles.typo]}>View All</Text>
				</TouchableOpacity>
			</View>

			<ScrollView contentContainerStyle={styles.content} horizontal showsHorizontalScrollIndicator={false}>
				{items.filter(_ => _.visibility === 'public').map(({ title, start, end, limit, visibility, owner, place, category, attendees }, i) => (
					<TouchableOpacity key={i} style={styles.block} onPress={() => navigate('Event', { name })}>
						<Image style={styles.image} resizeMode="cover" source={{ uri: 'https://loremflickr.com/640/480/' + title }} />
						{category?.name && <Badge style={styles.category}>{category?.name}</Badge>}

						<View style={styles.container}>
							<Badge style={styles.price} size={25}>{Number(attendees?.length ?? 0) + ' / ' + (limit ? limit: '∞')}</Badge>

							<View style={styles.row}>
								<Text style={[styles.text, styles.typo, { color: Color.body }]}>
									{start.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
								</Text>

								<Text style={[styles.text, styles.typo, { color: Color.body }]}>
									{/* if end.day is not the same as start.date, show it */}
									{end.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) !== start.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) && end.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
								</Text>
							</View>

							<Text style={[styles.text, styles.typo]}>{title}</Text>

							<View style={styles.row}>
								<Avatar.Image size={20} source={{ uri: 'https://picsum.photos/seed/picsum/200/300' }} />
								<Text style={[styles.text, styles.typo, { color: Color.body }]}>{owner?.username ?? '@eventify'}</Text>
							</View>
						</View>
					</TouchableOpacity>
				))}

				{items.length === 0 && (
					<View style={styles.container}>
						<Text style={[styles.text, styles.typo]}>No events found</Text>
					</View>
				)}
			</ScrollView>
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
		color: Color.body,
		textTransform: 'capitalize'
	},
	content: {
		gap: 20,
		marginTop: 16,
		flexWrap: 'wrap',
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
		// paddingHorizontal: 10,
		justifyContent: 'center'
	},
	price: {
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
		textTransform: 'capitalize',
		fontFamily: FontFamily.medium
	}
})