import type { IconlyContextProps } from '@/contexts/IconlyContext'

/* Fonts */
export const FontFamily = {
	black: 'WorkSans-Black',
	blackItalic: 'WorkSans-BlackItalic',
	bold: 'WorkSans-Bold',
	boldItalic: 'WorkSans-BoldItalic',
	extraBold: 'WorkSans-ExtraBold',
	extraBoldItalic: 'WorkSans-ExtraBoldItalic',
	extraLight: 'WorkSans-ExtraLight',
	extraLightItalic: 'WorkSans-ExtraLightItalic',
	italic: 'WorkSans-Italic',
	light: 'WorkSans-Light',
	lightItalic: 'WorkSans-LightItalic',
	medium: 'WorkSans-Medium',
	mediumItalic: 'WorkSans-MediumItalic',
	regular: 'WorkSans-Regular',
	semiBold: 'WorkSans-SemiBold',
	semiBoldItalic: 'WorkSans-SemiBoldItalic',
	thin: 'WorkSans-Thin',
	thinItalic: 'WorkSans-ThinItalic'
} as const

/* Font Sizes */
export const FontSize = {
	x2s: 10,
	xs: 12,
	sm: 14,
	base: 16,
	lg: 18,
	xl: 20,
	x2l: 22,
	title: 30
} as const

/* Colors */
export const Color = {
	white: '#fff',
	black: '#000',
	primary: '#5f60b9', // or 'slateblue' | 'blueviolet'
	secondary: 'blue',
	danger: '#dc362e',
	heading: '#1c1f34',
	body: '#6c757d',
	border: '#ebebeb',
	ghostwhite: '#f0f0fa',
	background: '#f6f7f9',
	chat: {
		// icon: '#b5bac1',
		icon: '#4e5058',
		input: '#ebecee',
	}
} as const

/* Paddings */
export const Padding = {
	x2s: 10,
	xs: 12,
	sm: 15, // TODO change to 14
	base: 16,
	lg: 18,
	xl: 20,
	x4l: 26
} as const

/* Borders */
export const Border = {
	x3s: 8,
	xs: 12,
	sm: 14,
	base: 16,
	xl: 20,
	x3l: 24
} as const

export const IconSizes = {
	small: '16px',
	medium: '24px',
	large: '32px',
	xlarge: '48px'
} as const

export const IconStrokes = {
	light: '1px',
	regular: '1.5px',
	bold: '2px'
} as const

export const getSize = (size: number | 'small' | 'medium' | 'large' | 'xlarge' = 'medium'): string => {
	if (typeof size === 'number') return `${size}px`
	return IconSizes[size]
}

export const getStroke = (stroke: 'light' | 'regular' | 'bold' = 'regular') => IconStrokes[stroke]

export const getOpacity = (primaryColor: string | undefined, secondaryColor: string | undefined) => {
	if (!secondaryColor) return '0.4'
	return primaryColor === secondaryColor ? '0.4' : '1'
}

export const getThemeProp = (prop: 'primaryColor' | 'secondaryColor' | 'size' | 'set' | 'stroke', theme: IconlyContextProps): IconlyContextProps[typeof prop] => theme[prop]