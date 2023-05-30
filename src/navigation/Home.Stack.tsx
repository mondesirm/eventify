import { CardStyleInterpolators, createStackNavigator, } from '@react-navigation/stack'

import Blank from '@/screens/Blank'
import Home from '@/screens/main/Home'

const { Navigator, Screen } = createStackNavigator()

const screens = [
	{ name: 'Home', component: Home },
	{ name: 'Category', component: Blank }
]

export default () => {
	return (
		<Navigator initialRouteName={screens[0].name} screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }}>
			{screens.map(({ name, component }) => <Screen key={name} name={name} component={component} />)}
		</Navigator>
	)
}