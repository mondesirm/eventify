import { CardStyleInterpolators, StackNavigationProp, createStackNavigator } from '@react-navigation/stack'
import { SharedElementsComponentConfig, createSharedElementStackNavigator } from 'react-navigation-shared-element'

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
	{ name: 'Category', component: Blank, sharedElements: route => [{ id: route.params._.id }] },
	{ name: 'Places', component: Places },
	{ name: 'Place', component: Blank, sharedElements: route => [{ id: route.params._.id }] }
]

export default function ExploreStack() {
	return (
		<Navigator initialRouteName={screens[0].name} screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false  }}>
			{screens.map(({ name, component, sharedElements }) => <Screen key={name} name={name} component={component} sharedElements={sharedElements} />)}
		</Navigator>
	)
}