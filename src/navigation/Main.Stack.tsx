import { Platform, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Iconly from '@/icons'
import Blank from '@/screens/Blank'
import Home from '@/screens/main/Home'
import { Color, FontFamily } from 'globals'

const { Navigator, Screen } = createBottomTabNavigator()

export default function () {
	const screens = [
		{ name: 'Home', component: Home, Iconly: Iconly.Home },
		{ name: 'Calendar', component: Blank, Iconly: Iconly.Calendar },
		{ name: 'Explore', component: Blank, Iconly: Iconly.Category },
		{ name: 'Chat', component: Blank, Iconly: Iconly.Chat },
		{ name: 'Profile', component: Blank, Iconly: Iconly.User }
	]

	return (
		<Navigator screenOptions={{ headerShown: false }}>
			{screens.map(({ name, component, Iconly }, i) => (
				<Screen key={i} name={name} component={component}
					options={{
						tabBarIcon: _ => (
							<View style={{ bottom: Platform.OS === 'ios' ? -5 : 0 }}>
								<Iconly set={_.focused ? 'bulk' : undefined} />
							</View>
						),
						tabBarShowLabel: false, // With and without both look good
						tabBarLabel: _ => <Text style={{ fontFamily: FontFamily.medium, fontSize: 12, color: _.focused ? Color.primary : _.color }}>{_.children}</Text>
					}}
				/>
			))}
		</Navigator>
	)
}