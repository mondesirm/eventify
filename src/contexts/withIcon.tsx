import React, { memo, useContext } from 'react'
import Svg, { SvgProps } from 'react-native-svg'

import { IconlyContext, Theme } from '@/contexts/IconlyContext'
import { getSize, getThemeProp, getStroke, getOpacity } from 'globals'

export interface Props extends SvgProps {
	label?: string
	filled?: boolean
	primaryColor?: string
	secondaryColor?: string
	size?: number | 'small' | 'medium' | 'large' | 'xlarge'
	set?: 'bold' | 'bulk' | 'light' | 'broken' | 'two-tone' | 'curved'
	stroke?: 'light' | 'regular' | 'bold'
}

export default function (Component: React.ElementType): React.MemoExoticComponent<(props: Props) => JSX.Element> {
	const IconWrapper = ({ size, label, primaryColor, secondaryColor, filled, set, stroke, ...restProps }: Props) => {
		const theme = useContext(IconlyContext)
		const iconSize = getSize(size) || getSize(getThemeProp('size', theme) as Theme['size']) || '24px'
		const iconPrimaryColor = primaryColor || getThemeProp('primaryColor', theme) || 'currentColor'
		const iconSecondaryColor = secondaryColor || getThemeProp('secondaryColor', theme) || iconPrimaryColor || 'currentColor'

		return (
			<Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" aria-label={label || undefined} {...restProps}>
				<Component
					color={iconPrimaryColor}
					opacity={getOpacity(primaryColor, secondaryColor)}
					secondaryColor={iconSecondaryColor}
					set={filled ? 'bold' : set || getThemeProp('set', theme) || 'light' }
					strokeWidth={stroke ? getStroke(stroke) : getStroke(getThemeProp('stroke', theme) as Theme['stroke']) || '1.5px'}
				/>
			</Svg>
		)
	}

	const MemoIcon = memo(IconWrapper)
	return MemoIcon
}