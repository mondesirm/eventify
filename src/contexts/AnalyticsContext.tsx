import { createContext, useContext } from 'react'

interface AnalyticsContextProps {
	appId?: string
	service?: string
	visitorId?: string
	sessionId?: string
}

export const AnalyticsContext = createContext<AnalyticsContextProps>({
})

export const useAnalytics = () => {
	const context = useContext(AnalyticsContext)

	if (context === undefined) throw new Error('useAnalytics must be used within a AnalyticsProvider.')
	return context
}

export default ({ children }) => {
	const value = {
	}

	return (<AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>)
}