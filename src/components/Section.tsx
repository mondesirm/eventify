import { useEffect, useState } from 'react'
import { Rating } from 'react-native-ratings'
import { Avatar, Badge } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native'

import { Event, Place, useStoreActions } from '@/store'
import { Border, Color, FontFamily, FontSize } from 'globals'

interface SectionProps<T extends 'event' | 'place' = any> extends ViewProps {
    type: T
    limit?: number
	refreshing?: boolean
}

const { width } = Dimensions.get('window')

export default function Section({ type, limit = null, refreshing = false }: SectionProps) {
	const query = useStoreActions(({ db }) => db.query)
	const { navigate } = useNavigation<StackNavigationProp<any, any>>()
	const [items, setItems] = useState<(typeof type extends 'event' ? Event<true> : Place<true>)[]>([])

	useEffect(() => { query({ path: type + 's', limit }).then(docs => setItems(docs as typeof items)) }, [limit, refreshing])

	const renderItems = () => {
		if (items.length === 0) return <Text style={[styles.text, styles.typo]}>No {type + 's'} found</Text>

		switch (type) {
			case 'event':
				return (items as Event<true>[]).filter(_ => _.visibility === 'public').map(({ id, uri, title, start, end, limit, visibility, owner, place, category, attendees }, i) => (
					<TouchableOpacity key={i} style={styles.block} onPress={() => navigate('Event', { id })}>
						<Image style={styles.image} resizeMode="cover" source={{ uri : uri || 'https://fakeimg.pl/260/7750f8/FFF/?text=No%20Image&font=lobster&font_size=50' }} />
						{category?.name && <Badge style={styles.category}>{category?.name}</Badge>}

						<View style={styles.container}>
							<Badge style={styles.badge} size={25}>{Number(attendees?.length ?? 0) + ' / ' + (limit ? limit : '∞')}</Badge>

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
				))

			case 'place':
				return (items as Place<true>[]).map(({ id, name, uri, price, rating, category }, i) => (
					<TouchableOpacity key={i} style={styles.block} onPress={() => navigate('Place', { id })}>
						<Image style={styles.image} resizeMode="cover" source={{ uri : uri || 'https://fakeimg.pl/260/7750f8/FFF/?text=No%20Image&font=lobster&font_size=50' }} />
						{category?.name && <Badge style={styles.category}>{category?.name}</Badge>}

						<View style={styles.container}>
							<Badge style={styles.badge} size={25}>{price === 0 ? 'FREE' : '$' + price}</Badge>

							<View style={styles.row}>
								<Rating imageSize={10} readonly startingValue={rating} />
								<Text style={[styles.text, styles.typo, { color: Color.body }]}>{rating.toPrecision(2)}</Text>
							</View>

							<Text style={[styles.text, styles.typo]}>{name}</Text>

							<View style={styles.row}>
								<Avatar.Image size={20} source={{ uri: 'https://picsum.photos/seed/picsum/200/300' }} />
								<Text style={[styles.text, styles.typo, { color: Color.body }]}>{'@eventify'}</Text>
							</View>
						</View>
					</TouchableOpacity>
				))
		}
	}

	return (
		<View style={styles.section}>
			<View style={styles.header}>
				<Text style={[styles.title, styles.typo]}>Trending {(type + 's')}</Text>

				<TouchableOpacity onPress={() => {}}>
					<Text style={[styles.more, styles.typo]}>View All</Text>
				</TouchableOpacity>
			</View>

			<ScrollView contentContainerStyle={styles.content} horizontal showsHorizontalScrollIndicator={false}>
				{renderItems()}
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
		textTransform: 'capitalize',
		fontFamily: FontFamily.medium
	}
})