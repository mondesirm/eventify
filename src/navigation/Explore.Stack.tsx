import { JSX } from 'react'
import { Image } from 'react-native'
import { IconButton } from 'react-native-paper'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { CardStyleInterpolators, StackNavigationProp, createStackNavigator } from '@react-navigation/stack'
import { SharedElementsComponentConfig, createSharedElementStackNavigator } from 'react-navigation-shared-element'

import Icons from '@/icons'
import { Color, FontFamily } from 'globals'
import Blank from '@/screens/Blank'
import Places from '@/screens/main/Places'
import Explore from '@/screens/main/Explore'
import Categories from '@/screens/main/Categories'

interface ScreenProps {
	navigation: StackNavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { Navigator, Screen } = createSharedElementStackNavigator()

const screens: { name: string, component: (props: ScreenProps) => JSX.Element, sharedElements?: SharedElementsComponentConfig }[] = [
	{ name: 'Explore', component: Explore },
	{ name: 'Categories', component: Categories },
	{ name: 'Category', component: Blank, sharedElements: route => [{ id: route.params._.id }],  },
	{ name: 'Places', component: Places },
	{ name: 'Place', component: Blank, sharedElements: route => [{ id: route.params._.id }] }
]

export default function ExploreStack() {
	return (
		<Navigator initialRouteName={screens[0].name} screenOptions={{
			cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
			headerBackImage: () => <Icon style={{ marginLeft: 12 }} name="chevron-left" size={30} color={Color.white} />,
			// headerBackImage: () => <Icons.ChevronLeft style={{ marginLeft: 12 }} set="bold" size={30} color={Color.white} />,
			headerStyle: { backgroundColor: Color.primary },
			headerTitleStyle: { color: Color.white, fontFamily: FontFamily.bold },
			headerBackTitleStyle: { color: Color.white, fontFamily: FontFamily.medium }
			// headerRight: () => <IconButton icon="refresh" iconColor={Color.white} />
		}}>
			{screens.map(({ name, component, sharedElements }) => <Screen key={name} name={name} component={component} sharedElements={sharedElements} />)}
		</Navigator>
	)
}