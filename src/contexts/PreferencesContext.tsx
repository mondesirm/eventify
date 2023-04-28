import { createContext, useContext } from 'react'

export const PreferencesContext = createContext({
	isThemeDark: false,
	toggleTheme: () => {}
})

export const usePreferences = () => useContext(PreferencesContext)

export default function PreferencesContextProvider({ children }) {
	const toggleTheme = () => {}

	const value = {
		isThemeDark: false,
		toggleTheme
	}

	return (<PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>)
}