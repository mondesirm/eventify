import _ from 'lodash'
import { forwardRef, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { I18nManager, Platform, StyleSheet, Text } from 'react-native'
import { MD3Colors, TextInput, TextInputProps } from 'react-native-paper'

import Icons from '@/icons'
import { useNavs } from '@/contexts/PreferencesContext'
import { Border, Color, FontFamily, FontSize, Padding } from 'globals'

export interface InputProps<T = 'search'> extends TextInputProps {
	navs?: [number, ReturnType<typeof useNavs>]
	type?: string
	left?: T extends 'search' ? Lowercase<keyof typeof Icons> : keyof typeof MaterialCommunityIcons.glyphMap
	right?: T extends 'search' ? Lowercase<keyof typeof Icons> : keyof typeof MaterialCommunityIcons.glyphMap
	errors?: [boolean, any]
	onPressLeft?: () => void
	onPressRight?: () => void
}

const isAndroidRTL = I18nManager.isRTL && Platform.OS === 'android'

export default forwardRef((props: InputProps, ref) => {
	const [secureTextEntry, setSecureTextEntry] = useState(true)

	// Customize autoComplete and keyboardType based on type
	const types: Record<string, [typeof TextInput.defaultProps.autoComplete, typeof TextInput.defaultProps.keyboardType]> = {
		username: ['username', 'default'],
		phone: ['tel', 'phone-pad'],
		email: ['email', 'email-address'],
		password: ['password', 'visible-password'],
		search: ['off', 'web-search']
	}

	const isPassword = ['password', 'confirm'].includes(props.type)
	const toggle = secureTextEntry ? 'eye-outline' : 'eye-off-outline'

	return (
		<>
			<TextInput
				{...props}
				ref={ref}
				error={props.errors?.[0] && props.errors?.[1] as any}
				value={props?.type === 'phone' ? props.value.replace(/[\D]/g, '') : props.value.trim()}
				mode={props.mode || 'outlined'}
				placeholder={props.placeholder || typeof props.label === 'string' && props.label}
				secureTextEntry={isPassword && secureTextEntry}
				outlineStyle={props.outlineStyle || styles.input}
				outlineColor={props.outlineColor || 'transparent'}
				style={props.style || [styles.input, styles.text]}
				activeOutlineColor={props.activeOutlineColor || Color.primary}
				placeholderTextColor={props.placeholderTextColor || Color.body}
				autoComplete={types[props.type]?.[0] || props.autoComplete}
				keyboardType={types[props.type]?.[1] || props.keyboardType}
				returnKeyType={props.returnKeyType || 'next'}
				enablesReturnKeyAutomatically
				onPressIn={() => props.navs && props.navs[1]?.setCurr(props.navs?.[0])}
				onSubmitEditing={() => props.navs && props.navs[1]?.next(props.navs?.[0])}
				left={props.left && <TextInput.Icon icon={() => props.type === 'search'
					? <Icons.Location />
					: <Icon name={props.left as keyof typeof MaterialCommunityIcons.glyphMap} size={24} color={Color.primary} />} onPress={props.onPressLeft} />
				}
				right={(isPassword || props.right) && <TextInput.Icon icon={() => props.type === 'search'
					? <Icons.Discovery />
					: <Icon name={isPassword ? toggle : props.right as keyof typeof MaterialCommunityIcons.glyphMap} size={24} color={Color.primary} />} onPress={() => isPassword ? setSecureTextEntry(!secureTextEntry) : props.onPressRight} />}
			/>

			{props.errors?.[0] && props.errors?.[1] && <Text style={styles.error}>{props.errors[1].charAt(0).toUpperCase() + props.errors[1].slice(1).toLowerCase()}.</Text>}
		</>
	)
}) as React.FC<InputProps>

const styles = StyleSheet.create({
	input: {
		fontSize: FontSize.sm,
		borderRadius: Border.xs,
		backgroundColor: Color.background,
		textAlign: isAndroidRTL ? 'right' : 'left'
	},
	text: {
		color: Color.body,
		fontWeight: '500',
		fontFamily: FontFamily.medium
	},
	error: {
		bottom: -20,
		fontSize: 10,
		position: 'absolute',
		color: MD3Colors.error50 // TODO Color.danger
	},
	box: {
		shadowOffset: {
			width: 0,
			height: 24
		},
		shadowRadius: 10,
		shadowOpacity: 1,
		alignItems: 'center',
		shadowColor: '#0002',
		flexDirection: 'row',
		padding: Padding.base,
		borderRadius: Border.x3s,
		backgroundColor: Color.white
	},
	location: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
})