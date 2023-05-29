import _ from 'lodash'
import { forwardRef, useState } from 'react'
import { MD3Colors, TextInput } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { I18nManager, Platform, StyleSheet, Text, View } from 'react-native'
import { Props } from 'react-native-paper/lib/typescript/src/components/TextInput/TextInput'

import { useNavs } from '@/contexts/PreferencesContext'
import { Border, Color, FontFamily, FontSize } from 'globals'

interface InputViewProps extends Props {
	errors?: [boolean, string]
	type?: string
	navs?: [number, ReturnType<typeof useNavs>]
	left?: keyof typeof MaterialCommunityIcons.glyphMap
	right?: keyof typeof MaterialCommunityIcons.glyphMap
	onPressLeft?: () => void
	onPressRight?: () => void
}

const isAndroidRTL = I18nManager.isRTL && Platform.OS === 'android'

export default forwardRef((props: InputViewProps, ref) => {
	const [secureTextEntry, setSecureTextEntry] = useState(true)

	// Customize autoComplete and keyboardType based on type
	const types: Record<string, [typeof TextInput.defaultProps.autoComplete, typeof TextInput.defaultProps.keyboardType]> = {
		username: ['username', 'default'],
		phone: ['tel', 'phone-pad'],
		email: ['email', 'email-address'],
		password: ['password', 'visible-password']
	}

	const isPassword = ['password', 'confirm'].includes(props.type)
	const toggle = secureTextEntry ? 'eye-outline' : 'eye-off-outline'

	return (
		<View>
			<TextInput
				{...props}
				ref={ref}
				error={props.errors[0] && props.errors[1] as any}
				value={props?.type === 'phone' ? props.value.replace(/[\D]/g, '') : props.value.trim()}
				mode={props.mode || 'outlined'}
				placeholder={typeof props.label === 'string' && props.label}
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
				left={props.left && <TextInput.Icon icon={() => <Icon name={props.left} size={24} color={Color.primary} />} onPress={props.onPressLeft} />}
				right={(isPassword || props.right) && <TextInput.Icon icon={() => <Icon name={isPassword ? toggle : props.right} size={24} color={Color.primary} />} onPress={() => isPassword ? setSecureTextEntry(!secureTextEntry) : props.onPressRight} />}
			/>

			{props.errors[0] && props.errors[1] && <Text style={styles.error}>{props.errors[1].charAt(0).toUpperCase() + props.errors[1].slice(1).toLowerCase()}.</Text>}
		</View>
	)
}) as React.FC<InputViewProps>

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
		color: MD3Colors.error50
	}
})