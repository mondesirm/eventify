import { CardStyleInterpolators, createStackNavigator, } from '@react-navigation/stack'

import Login from '@/screens/auth/Login'
import Register from '@/screens/auth/Register'
import MainStack from '@/navigation/Main.Stack'
import ForgotPassword from '@/screens/auth/ForgotPassword'

const { Navigator, Screen } = createStackNavigator()

const screens = [
	{ name: 'Login', component: Login },
	{ name: 'Register', component: Register },
	{ name: 'ForgotPassword', component: ForgotPassword },
	{ name: 'MainStack', component: MainStack }
]

export default function AuthStack() {
	return (
		<Navigator initialRouteName="Login" screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }}>
			{screens.map(({ name, component }) => <Screen key={name} name={name} component={component} />)}
		</Navigator>
	)
}