import { JSX } from 'react'
import { BlurView } from 'expo-blur'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { Icon } from '@/icons'
import Blank from '@/screens/Blank'
import { iconly } from '@/utils/icon'
import Chat from '@/screens/main/Chat'
import { Color, FontFamily } from 'globals'
import Calendar from '@/screens/main/Calendar'
import HomeStack from '@/navigation/Home.Stack'
import ExploreStack from '@/navigation/Explore.Stack'

interface ScreenProps {
	navigation: BottomTabNavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { Navigator, Screen } = createBottomTabNavigator()

export const screens = [
	{ name: 'HomeStack', component: HomeStack, icon: iconly('home') },
	{ name: 'Calendar', component: Calendar, icon: iconly('calendar') },
	{ name: 'ExploreStack', component: ExploreStack, icon: iconly('discovery') },
	{ name: 'Chat', component: Chat, icon: iconly('chat') },
	{ name: 'Profile', component: Blank, icon: iconly('user') }
] as const

export default function MainStack() {
	return (
		<Navigator initialRouteName={screens[0].name} screenOptions={({ route }) => ({
			headerShown: false,
			tabBarShowLabel: false, // With and without both look good
			tabBarStyle: [{ position: 'absolute', borderTopWidth: 0 }, route.name === 'Places' && { display: 'none' }],
			tabBarBackground: () => <BlurView intensity={75} tint='light' style={StyleSheet.absoluteFill} />
		})}>
			{screens.map(({ name, component, icon }, i) => (
				<Screen key={i} name={name} component={component}
					options={{
						tabBarIcon: _ => (
							<View style={{ bottom: Platform.OS === 'ios' ? -5 : 0 }}>
								<Icon name={icon} set={_.focused ? 'bulk' : 'two-tone'} />
							</View>
						),
						tabBarLabel: _ => <Text style={{ fontFamily: FontFamily.medium, fontSize: 12, color: _.focused ? Color.primary : _.color }}>{_.children}</Text>
					}}
				/>
			))}
		</Navigator>
	)
}