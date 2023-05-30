import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native'

import { StackNavigationProp } from '@react-navigation/stack'
import { Border, Color, FontFamily, FontSize } from 'globals'

interface Category {
	name: string
	icon: keyof typeof MaterialCommunityIcons.glyphMap
}

interface SectionProps extends ViewProps {
	max?: number
}

const { width } = Dimensions.get('window')

const categories: Category[] = [
	{ name: 'Parties', icon: 'party-popper' },
	{ name: 'Gatherings', icon: 'account-group' },
	{ name: 'Outings', icon: 'account-child' },
	{ name: 'Balls', icon: 'dance-ballroom' },
	{ name: 'Breathers', icon: 'nature-people' },
	{ name: 'Mature', icon: 'dance-pole' }
]

export default ({ max = null }: SectionProps) => {
	const { navigate } = useNavigation<StackNavigationProp<any, any>>()

	return (
		<View style={styles.section}>
			<View style={styles.header}>
				<Text style={[styles.title, styles.typo]}>Categories</Text>

				<TouchableOpacity onPress={() => {}}>
					<Text style={[styles.more, styles.typo]}>View All</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.content}>
				{(max ? categories.slice(0, max) : categories).map(({ name, icon }, i) => (
					<TouchableOpacity key={i} style={styles.block} onPress={() => navigate('Category', { name })}>
						<View style={styles.image}>
							<Icon name={icon} size={38} />
						</View>

						<View style={styles.container}>
							<Text style={[styles.text, styles.typo]}>{name}</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>
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
		flexDirection: 'row'
	},
	block: {
		flexGrow: 1,
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: Border.xs,
		flexDirection: 'column',
		borderColor: Color.border,
		backgroundColor: Color.white,
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
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		color: Color.heading,
		fontSize: FontSize.xs,
		textTransform: 'capitalize',
		fontFamily: FontFamily.medium
	}
})