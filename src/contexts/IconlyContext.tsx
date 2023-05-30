// Source: https://github.com/lnanhkhoa/react-native-iconly

import Svg, { SvgProps } from 'react-native-svg'
import { createContext, memo, useContext } from 'react'
import { getSize, getThemeProp, getStroke, getOpacity } from 'globals'

export interface IconlyContextProps {
	primaryColor?: string
	secondaryColor?: string
	size?: number | 'small' | 'medium' | 'large' | 'xlarge'
	set?: 'bold' | 'bulk' | 'light' | 'broken' | 'two-tone' | 'curved'
	stroke?: 'light' | 'regular' | 'bold'
}

export const IconlyContext = createContext<IconlyContextProps>({
	primaryColor: 'currentColor',
	set: 'light',
	size: 'medium',
	stroke: 'regular'
})
IconlyContext.displayName = 'IconlyIconlyContext'

export const useIconlyTheme = () => {
	const context = useContext(IconlyContext)

	if (context === undefined) throw new Error('useIconlyTheme must be used within a IconlyProvider.')
	return context
}

export type IconlyWrapperProps = SvgProps & IconlyContextProps & {
	label?: string
	filled?: boolean
}

export const withIcon = (Component: React.ElementType): React.MemoExoticComponent<(props: IconlyWrapperProps) => JSX.Element> => {
	const IconWrapper = ({ size, label, primaryColor, secondaryColor, filled, set, stroke, ...restProps }: IconlyWrapperProps) => {
		const theme = useContext(IconlyContext)
		const iconSize = getSize(size) || getSize(getThemeProp('size', theme) as IconlyContextProps['size']) || '24px'
		const iconPrimaryColor = primaryColor || getThemeProp('primaryColor', theme) || 'currentColor'
		const iconSecondaryColor = secondaryColor || getThemeProp('secondaryColor', theme) || iconPrimaryColor || 'currentColor'

		return (
			<Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" aria-label={label || undefined} {...restProps}>
				<Component
					color={iconPrimaryColor}
					opacity={getOpacity(primaryColor, secondaryColor)}
					secondaryColor={iconSecondaryColor}
					set={filled ? 'bold' : set || getThemeProp('set', theme) || 'light' }
					strokeWidth={stroke ? getStroke(stroke) : getStroke(getThemeProp('stroke', theme) as IconlyContextProps['stroke']) || '1.5px'}
				/>
			</Svg>
		)
	}

	const MemoIcon = memo(IconWrapper)
	return MemoIcon
}

export default ({ children, primaryColor, secondaryColor, set, size, stroke }: IconlyContextProps & { children: React.ReactNode }) => {
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