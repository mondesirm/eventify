import { CardStyleInterpolators, createStackNavigator, } from '@react-navigation/stack'

import Login from '@/screens/Login'
import Register from '@/screens/Register'
import ForgotPassword from '@/screens/ForgotPassword'
// import BottomTabNavigator from '@/screens/BottomTabNavigator'

const { Navigator, Screen } = createStackNavigator()

export default function AuthStack() {
	return (
		<Navigator
			initialRouteName="Login"
			screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerMode: 'none' }}
		>
			<Screen name="Login" component={Login} />
			<Screen name="Register" component={Register} />
			<Screen name="ForgotPassword" component={ForgotPassword} />
			{/* <Screen name="BottomTabNavigator" component={BottomTabNavigator} /> */}
		</Navigator>
	)
}