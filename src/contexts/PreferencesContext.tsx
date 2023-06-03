import { FAB } from 'react-native-paper'
import { I18n, TranslateOptions } from 'i18n-js'
import * as Localization from 'expo-localization'
import { LocaleConfig } from 'react-native-calendars'
import { createContext, useContext, useEffect, useState } from 'react'
import { GestureResponderEvent, Keyboard, TextInput } from 'react-native'

import { Color } from 'globals'
import { locales, AllowedScope } from '@/locales'

type CustomI18n = typeof I18n.prototype & { __?: (scope: AllowedScope, options?: TranslateOptions) => string }

interface PreferencesContextProps {
	i18n: CustomI18n
	setLang: (lang: keyof typeof locales) => void
}

export const PreferencesContext = createContext<PreferencesContextProps>({
	i18n: null,
	setLang: null
})

export const usePreferences = () => {
	const context = useContext(PreferencesContext)

	if (context === undefined) throw new Error('usePreferences must be used within a PreferencesProvider.')
	return context
}

export const useI18n = () => usePreferences().i18n

export const useNavs = (inputs: React.MutableRefObject<TextInput>[] = [], style: typeof FAB.defaultProps.style = { right: 20, position: 'absolute', backgroundColor: Color.primary }) => {
	const [curr, setCurr] = useState(0)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const listeners = [
			Keyboard.addListener('keyboardWillShow', () => setVisible(true)),
			Keyboard.addListener('keyboardWillHide', () => setVisible(false))
		]
		return () => listeners.forEach(l => l.remove())
	}, [])

	const prev = (index: number = curr) => {
		if (index === 0) return
		inputs?.[index - 1].current?.focus()
		setCurr(index - 1)
	}

	const next = (index: number = curr) => {
		if (index === inputs.length - 1) return
		inputs?.[index + 1].current?.focus()
		setCurr(index + 1)
	}

	const fabs = () => (
		<>
			<FAB style={[style, { top: 80 }]} visible={visible} color="white" customSize={32} icon="arrow-up" onPress={() => prev()} />
			<FAB style={[style, { top: 120 }]} visible={visible} color="white" customSize={32} icon="arrow-down" onPress={() => next()} />
		</>
	)

	const dismiss = (e: GestureResponderEvent) => e.target === e.currentTarget && Keyboard.dismiss()

	return { curr, setCurr, prev, next, fabs, dismiss }
}

export default function PreferencesProvider({ children }: { children: React.ReactNode }) {
	const i18n: CustomI18n = new I18n(locales, { defaultSeparator: '/' })
	i18n.enableFallback = true
	i18n.missingBehavior = 'error' // TODO put 'guess' in production, 'error' in local
	i18n.locale = Localization.locale
	i18n.__ = (scope: AllowedScope, options?: TranslateOptions) => i18n.t(scope, options) // Custom __ function with a better scope type

	// Add locales to react-native-calendars (en is already added by default)
	LocaleConfig.locales['fr'] = locales.fr.calendar
	LocaleConfig.defaultLocale = i18n.locale.split('-')[0] === 'en' ? '' : i18n.locale.split('-')[0]

	const setLang = (lang: keyof typeof locales) => {
		i18n.locale = lang
	}

	const value = {
		i18n,
		setLang
	}

	return (<PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>)
}