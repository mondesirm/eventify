import type { Theme } from '@/contexts/IconlyContext'

/* Fonts */
export const FontFamily = {
	primary: 'WorkSans-Medium'
}

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
}

/* Colors */
export const Color = {
	white: '#fff',
	black: '#000',
	primary: '#5f60b9', // or 'slateblue' | 'blueviolet'
	secondary: 'blue',
	heading: '#1c1f34',
	body: '#6c757d',
	border: '#ebebeb',
	background: '#f6f7f9'
}

/* Paddings */
export const Padding = {
	x2s: 10,
	xs: 12,
	sm: 15, // TODO change to 14
	base: 16,
	lg: 18,
	xl: 20
}

/* Borders */
export const Border = {
	x3s: 8,
	xs: 12,
	xl: 20
}

export const IconSizes = {
	small: '16px',
	medium: '24px',
	large: '32px',
	xlarge: '48px'
}

export const IconStrokes = {
	light: '1px',
	regular: '1.5px',
	bold: '2px'
}

export const getSize = (size: number | 'small' | 'medium' | 'large' | 'xlarge' = 'medium'): string => {
	if (typeof size === 'number') return `${size}px`
	return IconSizes[size]
}

export const getStroke = (stroke: 'light' | 'regular' | 'bold' = 'regular') => IconStrokes[stroke]

export const getOpacity = (primaryColor: string | undefined, secondaryColor: string | undefined) => {
	if (!secondaryColor) return '0.4'
	return primaryColor === secondaryColor ? '0.4' : '1'
}

export const getThemeProp = (prop: 'primaryColor' | 'secondaryColor' | 'size' | 'set' | 'stroke', theme: Theme): Theme[typeof prop] => theme[prop]