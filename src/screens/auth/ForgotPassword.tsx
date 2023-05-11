import _ from 'lodash'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { Button } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { NavigationProp } from '@react-navigation/native'
import { Dimensions, GestureResponderEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import InputGroup from '@/components/InputGroup'
import { usePreferences } from '@/contexts/PreferencesContext'
import { Border, Color, FontFamily, FontSize, Padding } from 'globals'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width } = Dimensions.get('screen')

export default function ({ navigation, route }: ScreenProps) {
	const { i18n: { __ } } = usePreferences()
	const [code, setCode] = useState('')
	const [timer, setTimer] = useState(0)
	const [emailWasSent, setEmailWasSent] = useState(false)

	const schema = Yup.object().shape({
		email: Yup.string().email().required(),
		code: Yup.string().length(6).required().oneOf([code], 'Code doesn\'t match.')
	})
	
	const errors = _.mapValues(schema.fields, () => '')
	const values: Record<keyof Yup.InferType<typeof schema>, string> = errors
	values.email = route.params?.email || ''

	useEffect(() => console.log('code', code), [code])

	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => setTimer(timer - 1), 1000)
			return () => clearInterval(interval)
		}

		setCode('')
	}, [timer])

	const sendEmail = (email: string) => {
		setEmailWasSent(true)
		setCode(Math.random().toString(36).substring(2, 8).toUpperCase())
		setTimer(60)
		return Promise.resolve({ email })
	}

	const resetPassword = ({ email, code }) => Promise.resolve({ email, code })

	const getCode = (email: string) => {
		sendEmail(email)
			.then(res => Toast.show({ type: 'success', text1: 'Password Reset Email Sent', text2: 'Please check your mail inbox for it.' }))
			.catch(err => setTimeout(() => Toast.show({ type: 'error', text1: 'Password Reset Email Error', text2: JSON.stringify(err) }), 1000))
	}

	const onSubmit = ({ email, code }, actions: any) => {
		if (!emailWasSent || !code) return Toast.show({ type: 'error', text1: 'Invalid Code', text2: 'Please check your mail inbox for it or retry.' })

		resetPassword({ email, code })
			.then(res => {
				Toast.show({ type: 'success', text1: 'Password Reset Successfully', text2: 'Please login with your new password.' })
				navigation.navigate('Login', { email })
			}).catch(err => setTimeout(() => Toast.show({ type: 'error', text1: 'Password Reset Email Error', text2: JSON.stringify(err) }), 1000))
	}

	return (
		<ScrollView style={styles.screen} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
			<View style={styles.content}>
				<Text style={[styles.title, styles.typo]}>{__('forgot.title')}</Text>
				<Text style={[styles.subtitle, styles.typo]}>{__('forgot.subtitle')}</Text>
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
							<InputGroup autoFocus type="email" label={__('form.email')} left="email-outline" value={values.email} errors={[touched.email, errors.email]} onBlur={handleBlur('email')} onChangeText={handleChange('email')} />

							<View style={styles.group}>
								{emailWasSent && <InputGroup type="code" label={__('form.code')} left="key-outline" value={values.code} errors={[touched.code, errors.code]} onBlur={handleBlur('code')} onChangeText={handleChange('code')} />}

								<View style={[styles.extras, !emailWasSent && { display: 'none' }]}>
									<Text style={styles.text}>{timer > 0 ? __('forgot.expires') + ' ' +  timer + 's' : __('forgot.expired')}</Text>

									<TouchableOpacity onPress={() => touched.email && !errors.email && getCode(values.email)}>
										<Text style={[styles.link, styles.typo]}>{__('forgot.resend')}</Text>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.actions}>
								{emailWasSent ? (
									<Button
										disabled={!_.isEmpty(errors) || timer <= 0}
										labelStyle={[styles.submit, (!_.isEmpty(errors) || timer <= 0) && { color: Color.body }]}
										style={[styles.button, (!_.isEmpty(errors) || timer <= 0) && { backgroundColor: Color.border }]}
										onPress={handleSubmit as (e: GestureResponderEvent | React.FormEvent<HTMLFormElement> | undefined) => void}
									>
										{__('forgot.submit')}
									</Button>
								) : (
									<Button
										disabled={(!touched.email || !_.isEmpty(errors.email))}
										labelStyle={[styles.submit, (!touched.email || !_.isEmpty(errors.email)) && { color: Color.body }]}
										style={[styles.button, (!touched.email || !_.isEmpty(errors.email)) && { backgroundColor: Color.border }]}
										onPress={() => getCode(values.email)}
									>
										{__('forgot.send')}
								</Button>
								)}

								<View style={styles.other}>
									<Text style={styles.text}>{__('forgot.other.0')}&nbsp;</Text>

									{/* <TouchableOpacity onPress={() => navigation.navigate('Contact')}> */}
										<Text style={[styles.link, styles.typo]}>{__('forgot.other.1')}</Text>
									{/* </TouchableOpacity> */}
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
	group: {
		gap: 10
	},
	extras: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between'
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