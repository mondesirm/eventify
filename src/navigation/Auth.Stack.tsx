import { CardStyleInterpolators, createStackNavigator, } from '@react-navigation/stack'

import Login from '@/screens/auth/Login'
import Register from '@/screens/auth/Register'
import MainStack from '@/navigation/Main.Stack'
import ForgotPassword from '@/screens/auth/ForgotPassword'

const { Navigator, Screen } = createStackNavigator()

export default function AuthStack() {
	return (
		<Navigator
			initialRouteName="Login"
			screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }}
		>
			<Screen name="Login" component={Login} />
			<Screen name="Register" component={Register} />
			<Screen name="ForgotPassword" component={ForgotPassword} />
			<Screen name="MainStack" component={MainStack} />
		</Navigator>
	)
}