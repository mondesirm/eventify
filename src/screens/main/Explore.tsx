import { NavigationProp } from '@react-navigation/native'
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Icons, { Icon } from '@/icons'
import { useI18n } from '@/contexts/PreferencesContext'
import { Border, Color, FontFamily, FontSize } from 'globals'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width, height } = Dimensions.get('screen')

const screens: { name: string, icon: Lowercase<keyof typeof Icons> }[] = [
	{ name: 'Categories', icon: 'category' },
	{ name: 'Places', icon: 'location' },
	{ name: 'Events', icon: 'calendar' },
]

export default function Explore({ navigation }: ScreenProps) {
	const { __ } = useI18n()
	const bottomTabBarHeight = useBottomTabBarHeight()

	return (
		<SafeAreaView style={[styles.screen, { height: height - bottomTabBarHeight * 2 }]}>
			<View style={styles.content}>
				{screens.map(({ name, icon }, i) => (
					<TouchableOpacity key={i} style={styles.block} onPress={() => navigation.navigate(name)}>
						<View style={styles.image}>
							<Icon name={icon} size={57} />
						</View>

						<View style={styles.container}>
							<Text style={[styles.text, styles.typo]}>{name}</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Color.white
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-evenly'
	},
	block: {
		borderWidth: 1,
		width: width / 2,
		height: height / 5,
		borderStyle: 'solid',
		borderRadius: Border.xs,
		borderColor: Color.border
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
	typo: {
		textAlign: 'center',
		fontFamily: FontFamily.medium
	},
	text: {
		textAlign: 'center',
		color: Color.heading,
		fontSize: FontSize.base,
		textTransform: 'capitalize'
	}
})