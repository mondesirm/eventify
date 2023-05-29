import _ from 'lodash'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Button } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import { useEffect, useRef, useState } from 'react'
import { fetchSignInMethodsForEmail } from 'firebase/auth'
import { StackNavigationProp } from '@react-navigation/stack'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Animated, Dimensions, GestureResponderEvent, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { auth } from '@/utils/firebase'
import { AllowedScope } from '@/locales'
import { useStoreActions } from '@/store'
import InputView from '@/components/InputView'
import { useI18n, useNavs } from '@/contexts/PreferencesContext'
import { Border, Color, FontFamily, FontSize, Padding } from 'globals'

interface ScreenProps {
	navigation: StackNavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width } = Dimensions.get('screen')

export default ({ navigation, route }: ScreenProps) => {
	const { __ } = useI18n()
	const [code, setCode] = useState('')
	const [timer, setTimer] = useState(0)
	const y = useRef(new Animated.Value(0)).current
	const [emailWasSent, setEmailWasSent] = useState(false)
	const resetPassword = useStoreActions(({ auth }) => auth.resetPassword)
	// const resetPassword = ({ email, code }) => Promise.resolve({ email, code })

	const animation = {
		height: y.interpolate({ inputRange: [0, 150 - 80], outputRange: [150, 80], extrapolate: 'clamp' }),
		transform: [{ scale: y.interpolate({ inputRange: [0, 150 - 80], outputRange: [1, .8], extrapolate: 'clamp' }) }]
	}

	const schema = Yup.object().shape({
		email: Yup.string()
			.meta({ icon: 'email'})
			.label(__('form.email'))
			.email(__('errors.email'))
			.required(e => __('errors.required', e))
			.test('exists', e => __('errors.exists', e), v => fetchSignInMethodsForEmail(auth, v).then(m => m.length !== 0).catch(() => false)),
		code: Yup.string()
			.meta({ icon: 'key'})
			.label(__('form.code'))
			.length(6, e => __('errors.length', e))
			.required(e => __('errors.required', e))
			.is([code], __('errors.is', { is: __('form.code') }))
	})

	const errors = _.mapValues(schema.fields, () => '')
	const values: Record<keyof Yup.InferType<typeof schema>, string> = { ...errors, email: route.params?.email || '' }
	const inputs = Array.from({ length: _.keys(values).length }, () => useRef<TextInput>())
	const navs = useNavs(inputs)

	useEffect(() => { if (code) console.log('code', code) }, [code])

	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => setTimer(timer - 1), 1000)
			return () => clearInterval(interval)
		}

		setCode('')
	}, [timer])

	const sendEmail: (email: string) => Promise<AllowedScope[]> = (email: string) => {
		setEmailWasSent(true)
		setCode(Math.random().toString(36).substring(2, 8).toUpperCase())
		setTimer(60)
		// TODO: send email
		return Promise.resolve(['forgot.success.0', 'forgot.success.1'])
	}

	const getCode = (email: string) => {
		sendEmail(email)
			.then(res => Toast.show({ text1: __(res[0]), text2: __(res[1]) }))
			.catch(err => Toast.show({ type: 'error', text1: __('forgot.error') }))
	}

	const onSubmit = ({ email, code }) => {
		if (!emailWasSent || !code) return Toast.show({ type: 'error', text1: __('reset.error') })

		resetPassword(email)
			.then(res => {
				Toast.show({ text1: __(res[0]), text2: __(res[1]) })
				navigation.navigate('Login', { email })
			}).catch(err => Toast.show({ type: 'error', text1: __(err[0]), text2: __(err[1]) }))
	}

	return (
		<SafeAreaView style={styles.screen}>
			<Animated.View style={[styles.header, animation]}>
				<Text style={[styles.title, styles.typo]}>{__('forgot.title')}</Text>
				<Text style={[styles.subtitle, styles.typo]}>{__('forgot.subtitle')}</Text>
			</Animated.View>

			<KeyboardAwareScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" scrollEventThrottle={16} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: false } )}>
				<Formik
					initialValues={values}
					initialErrors={errors}
					validationSchema={schema}
					onSubmit={(v: typeof values) => onSubmit(v)}
				>
					{({ handleChange, handleSubmit, handleBlur, values, errors, touched }) => (
						<View style={styles.inputs}>
							<InputView ref={inputs[0]} navs={[0, navs]} autoFocus type="email" label={schema.fields['email'].describe()?.['label']} left={schema.fields['email'].describe()?.['meta']?.icon + '-outline' as any} value={values.email} errors={[touched.email, errors.email]} onBlur={handleBlur('email')} onChangeText={handleChange('email')} />

							<View style={styles.group}>
								{emailWasSent && <InputView ref={inputs[1]} navs={[1, navs]} type="code" label={schema.fields['code'].describe()?.['label']} left={schema.fields['code'].describe()?.['meta']?.icon + '-outline' as any} value={values.code} errors={[touched.code, errors.code]} onBlur={handleBlur('code')} onChangeText={handleChange('code')} />}

								<View style={[styles.extras, !emailWasSent && { display: 'none' }]}>
									<Text style={styles.text}>{timer > 0 ? __('forgot.expires', { timer }) : __('forgot.expired')}</Text>

									<TouchableOpacity disabled={timer > 30} style={timer > 30 && { opacity: .2 }} onPress={() => touched.email && !errors.email && getCode(values.email)}>
										<Text style={[styles.typo, styles.link]}>{__('forgot.resend')}</Text>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.actions}>
								{emailWasSent ? (
									<TouchableOpacity disabled={!_.isEmpty(errors) || timer <= 0} style={[styles.submit, (!_.isEmpty(errors) || timer <= 0) && { backgroundColor: Color.border }]} onPress={handleSubmit as (e: GestureResponderEvent | React.FormEvent<HTMLFormElement> | undefined) => void}>
										<Button labelStyle={[styles.button, (!_.isEmpty(errors) || timer <= 0) && { color: Color.body }]}>{__('forgot.submit')}</Button>
									</TouchableOpacity>
								) : (
									<TouchableOpacity disabled={(!touched.email || !_.isEmpty(errors.email))} style={[styles.submit, (!touched.email || !_.isEmpty(errors.email)) && { backgroundColor: Color.border }]} onPress={() => getCode(values.email)}>
										<Button labelStyle={[styles.button, (!touched.email || !_.isEmpty(errors.email)) && { color: Color.body }]}>{__('forgot.send')}</Button>
									</TouchableOpacity>
								)}

								<View style={styles.other}>
									<Text style={styles.text}>{__('forgot.other.0')}&nbsp;</Text>

									{/* <TouchableOpacity onPress={() => navigation.navigate('Contact')}> */}
										<Text style={[styles.typo, styles.link]}>{__('forgot.other.1')}</Text>
									{/* </TouchableOpacity> */}
								</View>
							</View>
						</View>
					)}
				</Formik>
			</KeyboardAwareScrollView>

			{navs.fabs()}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Color.white
	},
	header: {
		gap: 16,
		justifyContent: 'center'
	},
	typo: {
		textAlign: 'center',
		fontFamily: FontFamily.medium
	},
	title: {
		fontSize: FontSize.x2l,
		textTransform: 'capitalize'
	},
	subtitle: {
		color: Color.body,
		fontSize: FontSize.sm
	},
	scroll: {
		gap: 56,
		paddingHorizontal: 40,
		backgroundColor: Color.white
	},
	inputs: {
		gap: 24
	},
	text: {
		color: Color.body,
		fontFamily: FontFamily.medium
	},
	group: {
		gap: 30
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
	submit: {
		width: width - 80,
		flexDirection: 'row',
		borderRadius: Border.xs,
		justifyContent: 'center',
		paddingVertical: Padding.x2s,
		backgroundColor: Color.primary
	},
	button: {
		color: Color.white,
		fontSize: FontSize.base,
		textTransform: 'uppercase',
		fontFamily: FontFamily.semiBold
	},
	other: {
		flexDirection: 'row'
	},
	link: {
		color: Color.primary,
		fontSize: FontSize.sm,
		textDecorationLine: 'underline',
		fontFamily: FontFamily.semiBoldItalic
	}
})