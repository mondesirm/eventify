// Source: https://github.com/lnanhkhoa/react-native-iconly

import { createContext, useContext } from 'react'

export interface Theme {
	primaryColor?: string
	secondaryColor?: string
	size?: number | 'small' | 'medium' | 'large' | 'xlarge'
	set?: 'bold' | 'bulk' | 'light' | 'broken' | 'two-tone' | 'curved'
	stroke?: 'light' | 'regular' | 'bold'
}

interface Props extends Theme {
	children: React.ReactNode
}

const defaultValue: Theme = {
	primaryColor: 'currentColor',
	set: 'light',
	size: 'medium',
	stroke: 'regular'
}

export const IconlyContext = createContext(defaultValue)
IconlyContext.displayName = 'IconlyIconlyContext'

export default function ({ children, primaryColor, secondaryColor, set, size, stroke }: Props) {
	const value = {
		primaryColor: primaryColor || 'currentColor',
		secondaryColor,
		set: set || 'light',
		size: size || 'medium',
		stroke: stroke || 'regular'
	}

	return (
		<IconlyContext.Provider value={value}>
			{children}
		</IconlyContext.Provider>
	)
}

export const useIconlyTheme = () => {
	const context = useContext(IconlyContext)

	if (context === undefined) throw new Error('UseIconlyTheme must be Used within a IconlyProvider')
	return context
}