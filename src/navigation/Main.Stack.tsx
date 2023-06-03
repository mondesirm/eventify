import { MemoExoticComponent } from 'react'
import { Platform, Text, View } from 'react-native'
import { NavigationProp } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Blank from '@/screens/Blank'
import Icons, { Icon } from '@/icons'
import { Color, FontFamily } from 'globals'
import Calendar from '@/screens/main/Calendar'
import HomeStack from '@/navigation/Home.Stack'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { Navigator, Screen } = createBottomTabNavigator()

export default function MainStack() {
	const screens: { name: string, component: (props: ScreenProps) => JSX.Element, icon: Lowercase<keyof typeof Icons> }[] = [
		{ name: 'HomeStack', component: HomeStack, icon: 'home' },
		{ name: 'Calendar', component: Calendar, icon: 'calendar' },
		{ name: 'Explore', component: Blank, icon: 'category' },
		{ name: 'Chat', component: Blank, icon: 'chat' },
		{ name: 'Profile', component: Blank, icon: 'user' }
	]

	return (
		<Navigator initialRouteName={screens[0].name} screenOptions={{ headerShown: false }}>
			{screens.map(({ name, component, icon }, i) => (
				<Screen key={i} name={name} component={component}
					options={{
						tabBarIcon: _ => (
							<View style={{ bottom: Platform.OS === 'ios' ? -5 : 0 }}>
								<Icon name={icon} set={_.focused ? 'bulk' : 'two-tone'} />
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