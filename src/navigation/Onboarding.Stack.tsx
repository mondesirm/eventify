import { CardStyleInterpolators, createStackNavigator, } from '@react-navigation/stack'

import Onboarding from '@/screens/Onboarding'
import AuthStack from '@/navigation/Auth.Stack'

const { Navigator, Screen } = createStackNavigator()

export const screens = [
	{ name: 'Onboarding', component: Onboarding },
	{ name: 'AuthStack', component: AuthStack }
] as const

export default function OnboardingStack() {
	return (
		<Navigator initialRouteName={screens[0].name} screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }}>
			{screens.map(({ name, component }) => <Screen key={name} name={name} component={component} />)}
		</Navigator>
	)
}