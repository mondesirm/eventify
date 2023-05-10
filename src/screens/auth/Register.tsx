import _ from 'lodash'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { useState } from 'react'
import Toast from 'react-native-toast-message'
import { Button, MD3Colors } from 'react-native-paper'
import { NavigationProp } from '@react-navigation/native'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { Border, Color, FontFamily, FontSize, Padding } from 'GlobalStyles'
import { Dimensions, GestureResponderEvent, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'

import InputGroup from '@/components/InputGroup'
import { usePreferences } from '@/contexts/PreferencesContext'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const regex = /^0[0-9]{9}/
const { width } = Dimensions.get('screen')

const schema = Yup.object().shape({
	username: Yup.string().min(3).required(),
	phone: Yup.string().matches(regex).max(10).required().transform((b, a) => a.replace(/[^0-9]/g, '')),
	email: Yup.string().email().required(),
	password: Yup.string().min(8).required(),
	confirm: Yup.string().required().oneOf([Yup.ref('password')])
})

const errors = _.mapValues(schema.fields, () => '')
const values: Record<keyof Yup.InferType<typeof schema>, string> = errors

export default function ({ navigation }: ScreenProps) {
	const { i18n: { __ } } = usePreferences()

	const register = ({ username, phone, email, password, confirm }) => Promise.resolve({ username, phone, email, password, confirm })

	const onSubmit = ({ username, phone, email, password, confirm }, actions: any) => {
		register({ username, phone, email, password, confirm })
			.then(res => Toast.show({ type: 'success', text1: 'Register Success', text2: JSON.stringify(res) }))
			.catch(err => setTimeout(() => Toast.show({ type: 'error', text1: 'Register Error', text2: JSON.stringify(err) }), 1000))
	}

	return (
		<ScrollView style={styles.screen} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
			<View style={styles.content}>
				<Text style={[styles.title, styles.typo]}>{__('register.title')}</Text>
				<Text style={[styles.subtitle, styles.typo]}>{__('register.subtitle')}</Text>
			</View>

			<View style={styles.form}>
				<Formik
					initialValues={values}
					initialErrors={errors}
					validationSchema={schema}
					onSubmit={(values, actions) => onSubmit(values, actions)}
				>
					{({ handleChange, handleSubmit, handleBlur, values, errors, touched }) => (
						<View style={styles.inputs}>
							<InputGroup autoFocus type="username" label={__('form.username')} left="account-outline" value={values.username} errors={[touched.username, errors.username]} onBlur={handleBlur('username')} onChangeText={handleChange('username')} />
							<InputGroup type="email" label={__('form.email')} left="email-outline" value={values.email} errors={[touched.email, errors.email]} onBlur={handleBlur('email')} onChangeText={handleChange('email')} />
							<InputGroup type="phone" label={__('form.phone')} left="phone-outline" value={values.phone} errors={[touched.phone, errors.phone]} onBlur={handleBlur('phone')} onChangeText={handleChange('phone')} />
							<InputGroup type="password" label={__('form.password')} left="lock-outline" value={values.password} errors={[touched.password, errors.password]} onBlur={handleBlur('password')} onChangeText={handleChange('password')} />
							<InputGroup type="password" label={__('form.confirm')} left="lock-outline" value={values.confirm} errors={[touched.confirm, errors.confirm]} onBlur={handleBlur('confirm')} onChangeText={handleChange('confirm')} />

							<View style={styles.actions}>
								<Button
									disabled={!_.isEmpty(errors)}
									labelStyle={[styles.submit, !_.isEmpty(errors) && { color: Color.body }]}
									style={[styles.button, !_.isEmpty(errors) && { backgroundColor: Color.border }]}
									onPress={handleSubmit as (e: GestureResponderEvent | React.FormEvent<HTMLFormElement> | undefined) => void}
								>
									{__('register.submit')}
								</Button>

								<View style={styles.other}>
									<Text style={styles.text}>{__('register.other.0')}&nbsp;</Text>

									<TouchableOpacity onPress={() => navigation.navigate('Login')}>
										<Text style={[styles.link, styles.typo]}>{__('register.other.1')}</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					)}
				</Formik>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	screen: {
		flex: 1
	},
	content: {
		width,
		gap: 16,
		top: '10%'
	},
	typo: {
		fontWeight: '500',
		textAlign: 'center',
		fontFamily: FontFamily.primary
	},
	title: {
		fontSize: FontSize.x2l,
		textTransform: 'capitalize'
	},
	subtitle: {
		color: Color.body,
		fontSize: FontSize.sm
	},
	form: {
		width,
		top: '28%',
		position: 'absolute',
		alignItems: 'center'
	},
	inputs: {
		gap: 24
	},
	text: {
		color: Color.body,
		fontWeight: '500',
		fontFamily: FontFamily.primary
	},
	actions: {
		gap: 20,
		alignItems: 'center'
	},
	button: {
		width: width - 80,
		flexDirection: 'row',
		borderRadius: Border.xs,
		justifyContent: 'center',
		paddingVertical: Padding.x2s,
		backgroundColor: Color.primary
	},
	submit: {
		width: width - 80,
		// height: 40,
		borderWidth: 1,
		fontWeight: '600',
		color: Color.white,
		fontSize: FontSize.base,
		textTransform: 'uppercase',
		fontFamily: FontFamily.primary
	},
	other: {
		flexDirection: 'row'
	},
	link: {
		color: Color.primary,
		fontSize: FontSize.sm,
		textDecorationLine: 'underline'
	}
})