import { CardStyleInterpolators, createStackNavigator, } from '@react-navigation/stack'

import Onboarding from '@/screens/Onboarding'
import AuthStack from '@/navigation/Auth.Stack'

const { Navigator, Screen } = createStackNavigator()

export default function OnboardingStack() {
	return (
		<Navigator
			initialRouteName="Onboarding"
			screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }}
		>
			<Screen name="Onboarding" component={Onboarding} />
			<Screen name="AuthStack" component={AuthStack} />
		</Navigator>
	)
}