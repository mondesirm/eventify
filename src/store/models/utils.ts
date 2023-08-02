import { Action, action } from 'easy-peasy'
import { NetInfoState } from '@react-native-community/netinfo'

// import * as HomeStack from '@/navigation/Home.Stack'
// import * as MainStack from '@/navigation/Main.Stack'
// import * as ExploreStack from '@/navigation/Explore.Stack'
// import * as OnboardingStack from '@/navigation/Onboarding.Stack'

// type Screen = typeof HomeStack.screens | typeof MainStack.screens | typeof ExploreStack.screens | typeof OnboardingStack.screens
// type ScreenName = Lowercase<Screen[number]['name']>

// const firstVisits = [
// 	...HomeStack.screens,
// 	...MainStack.screens,
// 	...ExploreStack.screens,
// 	...OnboardingStack.screens
// ].reduce((acc, screen) => ({ ...acc, [screen.name]: true }), {} as Record<ScreenName, boolean>)

export interface UtilsModel<T extends string = 'onboarding' | 'home' | 'category'> {
	netInfoState: NetInfoState
	firstVisits: Record<T, boolean>
	setNetInfoState: Action<this, NetInfoState>
	setFirstVisits: Action<this, Partial<Record<T, boolean>>>
}

export default {
	netInfoState: null,
	firstVisits: { onboarding: true, home: true, category: true },
	setNetInfoState: action((state, payload) => { state.netInfoState = payload }),
	setFirstVisits: action((state, payload) => { state.firstVisits = { ...state.firstVisits, ...payload } })
} as UtilsModel