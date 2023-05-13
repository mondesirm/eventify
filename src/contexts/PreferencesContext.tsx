import { I18n, I18nOptions } from 'i18n-js'
import { locales, Translation } from '@/locales'
import * as Localization from 'expo-localization'
import { createContext, useContext } from 'react'

type CustomI18n = typeof I18n.prototype & { __?: (scope: Translation, options?: Partial<I18nOptions>) => string }

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

export default function ({ children }: { children: React.ReactNode }) {
	const i18n: CustomI18n = new I18n(locales)
	i18n.locale = Localization.locale
	i18n.enableFallback = true

	// Re-typing the scope parameter to ensure that it exists in the english locale
	i18n.__ = (scope: Translation, options?: Partial<I18nOptions>) => i18n.t(scope, options)

	const setLang = (lang: keyof typeof locales) => {
		i18n.locale = lang
	}

	const value = {
		i18n,
		setLang
	}

	return (<PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>)
}