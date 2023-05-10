import _ from 'lodash'
import { useState } from 'react'
import { MD3Colors, TextInput } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { usePreferences } from '@/contexts/PreferencesContext'
import { Border, Color, FontFamily, FontSize } from 'GlobalStyles'
import { Dimensions, StyleSheet, Text, View, I18nManager, Platform } from 'react-native'
import { Props } from 'react-native-paper/lib/typescript/src/components/TextInput/TextInput'

interface InputGroupProps extends Props {
	label: string
	value: string
	errors: [boolean, any]
	onBlur: Required<Props>['onBlur']
	onChangeText: Required<Props>['onChangeText']
	type?: string
	left?: keyof typeof MaterialCommunityIcons.glyphMap
	right?: keyof typeof MaterialCommunityIcons.glyphMap
}

const { width } = Dimensions.get('screen')
const isAndroidRTL = I18nManager.isRTL && Platform.OS === 'android'

export default function InputGroup(props: InputGroupProps) {
	const { i18n: { __ } } = usePreferences()
	const [secureTextEntry, setSecureTextEntry] = useState(true)

	// Customize autoComplete and keyboardType based on type
	const types: {
		[key: string]: [
			typeof TextInput.defaultProps.autoComplete,
			typeof TextInput.defaultProps.keyboardType
		]
	} = {
		username: ['username', 'default'],
		phone: ['tel', 'phone-pad'],
		email: ['email', 'email-address'],
		password: ['password', 'visible-password']
	}

	const isPassword = props.label.toLowerCase().includes('password')
	const toggle = secureTextEntry ? 'eye-outline' : 'eye-off-outline'

	return (
		<View style={styles.group}>
			<TextInput
				error={props.errors[0] && props.errors[1]}
				value={props?.type === 'phone' ? props.value.replace(/[^0-9]/g, '') : props.value.trim()}
				mode={props.mode || 'outlined'}
				label={props.label}
				placeholder={props.label}
				secureTextEntry={isPassword && secureTextEntry}
				outlineStyle={props.outlineStyle || styles.input}
				outlineColor={props.outlineColor || 'transparent'}
				style={props.style || [styles.input, styles.text]}
				activeOutlineColor={props.activeOutlineColor || Color.primary}
				placeholderTextColor={props.placeholderTextColor || Color.body}
				autoComplete={types[props.type]?.[0] || props.autoComplete}
				keyboardType={types[props.type]?.[1] || props.keyboardType}
				left={props.left && <TextInput.Icon icon={() => <Icon name={props.left} size={24} color={Color.primary} />} />}
				right={(isPassword || props.right) && <TextInput.Icon icon={() => <Icon name={isPassword ? toggle : props.right} size={24} color={Color.primary} />} onPress={() => isPassword && setSecureTextEntry(!secureTextEntry)} />}
				onBlur={props.onBlur}
				onChangeText={props.onChangeText}
			/>

			{props.errors[0] && props.errors[1] && <Text style={styles.error}>{props.errors[1]}</Text>}
		</View>
	)
}

const styles = StyleSheet.create({
	group: {
		gap: 10,
		flexDirection: 'column'
	},
	input: {
		width: width - 80,
		fontSize: FontSize.sm,
		borderRadius: Border.xs,
		backgroundColor: Color.background,
		textAlign: isAndroidRTL ? 'right' : 'left'
	},
	text: {
		color: Color.body,
		fontWeight: '500',
		fontFamily: FontFamily.primary
	},
	error: {
		fontSize: 10,
		color: MD3Colors.error50
	}
})