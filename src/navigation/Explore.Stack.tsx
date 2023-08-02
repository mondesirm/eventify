import { JSX } from 'react'
import { CardStyleInterpolators, StackNavigationProp, createStackNavigator } from '@react-navigation/stack'
import { SharedElementsComponentConfig, createSharedElementStackNavigator } from 'react-navigation-shared-element'

import Icons from '@/icons'
import Blank from '@/screens/Blank'
import Places from '@/screens/main/Places'
import { Color, FontFamily } from 'globals'
import Explore from '@/screens/main/Explore'
import Category from '@/screens/main/Category'
import Categories from '@/screens/main/Categories'

interface ScreenProps {
	navigation: StackNavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { Navigator, Screen } = createSharedElementStackNavigator()

const sharedElements = (cb: SharedElementsComponentConfig) => cb

export const screens = [
	{ name: 'Explore', component: Explore, sharedElements: null },
	{ name: 'Categories', component: Categories, sharedElements: null },
	{ name: 'Category', component: Category, sharedElements: sharedElements(route => [{ id: route.params._.id }]),  },
	{ name: 'Places', component: Places, sharedElements: null },
	{ name: 'Place', component: Blank, sharedElements: sharedElements(route => [{ id: route.params._.id }]) },
	{ name: 'Events', component: Blank, sharedElements: null },
	{ name: 'Event', component: Blank, sharedElements: sharedElements(route => [{ id: route.params._.id }]) }
] as const

export default function ExploreStack() {
	return (
		<Navigator initialRouteName={screens[0].name} screenOptions={{
			cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
			// headerBackImage: () => <Icon style={{ marginLeft: 12 }} name="chevron-left" size={30} color={Color.white} />,
			headerBackImage: () => <Icons.ChevronLeft style={{ marginLeft: 12 }} set="bold" size={30} primaryColor={Color.white} />,
			headerStyle: { backgroundColor: Color.primary },
			headerTitleStyle: { color: Color.white, fontFamily: FontFamily.bold },
			headerBackTitleStyle: { color: Color.white, fontFamily: FontFamily.medium }
			// headerRight: () => <IconButton icon="refresh" iconColor={Color.white} />
		}}>
			{screens.map(({ name, component, sharedElements }) => <Screen key={name} name={name} component={component} sharedElements={sharedElements} />)}
		</Navigator>
	)
}