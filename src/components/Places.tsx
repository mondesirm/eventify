import { useEffect, useState } from 'react'
import { Rating } from 'react-native-ratings'
import { Avatar, Badge } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native'

import { Place, useStoreActions } from '@/store'
import { Border, Color, FontFamily, FontSize } from 'globals'

interface SectionProps extends ViewProps {
	limit?: number
	refreshing?: boolean
}

const { width } = Dimensions.get('window')

export default function Places({ limit = null, refreshing = false }: SectionProps) {
	const [places, setPlaces] = useState<Place<true>[]>([])
	const query = useStoreActions(({ db }) => db.query)
	const { navigate } = useNavigation<StackNavigationProp<any, any>>()

	useEffect(() => { query({ path: 'places', limit }).then(docs => setPlaces(docs as Place<true>[])) }, [limit, refreshing])

	return (
		<View style={styles.section}>
			<View style={styles.header}>
				<Text style={[styles.title, styles.typo]}>Places</Text>

				<TouchableOpacity onPress={() => {}}>
					<Text style={[styles.more, styles.typo]}>View All</Text>
				</TouchableOpacity>
			</View>

			<ScrollView contentContainerStyle={styles.content} horizontal showsHorizontalScrollIndicator={false}>
				{places.map(({ name, uri, price, rating, category }, i) => (
					<TouchableOpacity key={i} style={styles.block} onPress={() => navigate('Place', { name })}>
						<Image style={styles.image} resizeMode="cover" source={{ uri }} />
						<Badge style={styles.badge}>{category.name}</Badge>

						<View style={styles.container}>
							<Badge style={styles.price} size={25}>{price === 0 ? 'FREE' : '$' + price}</Badge>

							<View style={styles.row}>
								<Rating imageSize={10} readonly startingValue={rating} />
								<Text style={[styles.text, styles.typo, { color: Color.body }]}>{rating.toPrecision(2)}</Text>
							</View>

							<Text style={[styles.text, styles.typo]}>{name}</Text>

							<View style={styles.row}>
								<Avatar.Image size={20} source={{ uri: 'https://picsum.photos/seed/picsum/200/300' }} />
								<Text style={[styles.text, styles.typo, { color: Color.body }]}>John Doe</Text>
							</View>
						</View>
					</TouchableOpacity>
				))}

				{places.length === 0 && (
					<View style={styles.container}>
						<Text style={[styles.text, styles.typo]}>No places found</Text>
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
	badge: {
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