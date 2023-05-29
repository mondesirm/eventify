import { Action, action } from 'easy-peasy'
import { NetInfoState } from '@react-native-community/netinfo'

export interface UtilsModel<T extends string = 'onboarding' | 'home'> {
	netInfoState: NetInfoState
	firstVisits: Record<T, boolean>
	setNetInfoState: Action<this, NetInfoState>
	setFirstVisits: Action<this, Partial<Record<T, boolean>>>
}

export default {
	netInfoState: null,
	firstVisits: { onboarding: true, home: true },
	setNetInfoState: action((state, payload) => { state.netInfoState = payload }),
	setFirstVisits: action((state, payload) => { state.firstVisits = { ...state.firstVisits, ...payload } })
} as UtilsModel