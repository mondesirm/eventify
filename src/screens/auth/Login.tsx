import _ from 'lodash'
import * as Yup from 'yup'
import { useEffect, useRef } from 'react'
import { Formik, FormikProps } from 'formik'
import Toast from 'react-native-toast-message'
import { Button, Switch } from 'react-native-paper'
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

const { width } = Dimensions.get('screen')

export default function ({ navigation, route }: ScreenProps) {
	const { i18n: { __ } } = usePreferences()

	const schema = Yup.object().shape({
		email: Yup.string().email().required(),
		password: Yup.string().min(8).required(),
		remember: Yup.boolean()
	})

	const errors = _.mapValues(schema.fields, () => '')
	const values: Record<keyof Yup.InferType<typeof schema>, string> = errors
	const form = useRef<FormikProps<typeof values>>(null)

	useEffect(() => { if (route.params?.email) form.current.setFieldValue('email', route.params?.email) }, [route.params?.email])

	const login = ({ email, password, remember }) => Promise.resolve({ email, password, remember })

	const onSubmit = ({ email, password, remember }, actions: any) => {
		login({ email, password, remember: Boolean(remember) })
			.then(res => Toast.show({ type: 'success', text1: 'Login Success', text2: JSON.stringify(res) }))
			.catch(err => setTimeout(() => Toast.show({ type: 'error', text1: 'Login Error', text2: JSON.stringify(err) }), 1000))
	}

	const signInWithGoogle = () => Toast.show({ type: 'success', text1: 'WIP Feature', text2: 'Signing with Google...' })
	const signInWithPhone = () => Toast.show({ type: 'success', text1: 'WIP Feature', text2: 'Signing with Phone...' })

	return (
		<ScrollView style={styles.screen} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
			<View style={styles.content}>
				<Text style={[styles.title, styles.typo]}>{__('login.title')}</Text>
				<Text style={[styles.subtitle, styles.typo]}>{__('login.subtitle')}</Text>
			</View>

			<View style={styles.form}>
				<Formik
					innerRef={form}
					initialValues={values}
					initialErrors={errors}
					validationSchema={schema}
					onSubmit={(values, actions) => onSubmit(values, actions)}
				>
					{({ handleChange, handleSubmit, handleBlur, setFieldValue, values, errors, touched }) => (
						<View style={styles.inputs}>
							<InputGroup autoFocus type="email" label={__('form.email')} left="email-outline" value={values.email} errors={[touched.email, errors.email]} onBlur={handleBlur('email')} onChangeText={handleChange('email')} />

							<View style={styles.group}>
								<InputGroup type="password" label={__('form.password')} left="lock-outline" value={values.password} errors={[touched.password, errors.password]} onBlur={handleBlur('password')} onChangeText={handleChange('password')} />

								<View style={styles.extras}>
									<View style={styles.remember}>
										<Switch color={Color.primary} value={Boolean(values.remember)} onValueChange={() => setFieldValue('remember', !values.remember)} />
										<Text style={styles.text}>{__('login.remember')}</Text>
									</View>

									<TouchableOpacity onPress={() => navigation.navigate('ForgotPassword', { email: values.email })}>
										<Text style={[styles.link, styles.typo]}>{__('login.forgot')}</Text>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.actions}>
								<Button
									disabled={!_.isEmpty(errors)}
									labelStyle={[styles.submit, !_.isEmpty(errors) && { color: Color.body }]}
									style={[styles.button, !_.isEmpty(errors) && { backgroundColor: Color.border }]}
									onPress={handleSubmit as (e: GestureResponderEvent | React.FormEvent<HTMLFormElement> | undefined) => void}
								>
									{__('login.submit')}
								</Button>

								<View style={styles.other}>
									<Text style={styles.text}>{__('login.other.0')}&nbsp;</Text>

									<TouchableOpacity onPress={() => navigation.navigate('Register')}>
										<Text style={[styles.link, styles.typo]}>{__('login.other.1')}</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					)}
				</Formik>
			</View>

			<View style={styles.providers}>
				<View style={styles.divider}>
					<View style={styles.line} />
					<Text style={[styles.continue, styles.text]}>{__('login.continue')}</Text>
					<View style={styles.line} />
				</View>

				<View style={styles.socials}>
					<TouchableHighlight style={styles.social} underlayColor={Color.primary} onPress={signInWithGoogle}>
						<>
							<Icon name="google" size={24} color={Color.primary} />
							<Text style={[styles.provider, styles.text]}>Google</Text>
						</>
					</TouchableHighlight>

					<TouchableOpacity style={styles.social} onPress={signInWithPhone}>
						<>
							<Icon name="phone" size={24} color={Color.primary} />
							<Text style={[styles.provider, styles.text]}>Phone</Text>
						</>
					</TouchableOpacity>
				</View>
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
	remember: {
		gap: 10,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center'
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
	},
	providers: {
		gap: 20,
		left: 20,
		right: 20,
		top: '70%',
		width: width - 40,
		position: 'absolute',
		alignItems: 'center',
		flexDirection: 'column'
	},
	divider: {
		gap: 20,
		alignItems: 'center',
		flexDirection: 'row'
	},
	line: {
		flex: 1,
		height: 2,
		backgroundColor: Color.border
	},
	continue: {
		textTransform: 'capitalize'
	},
	socials: {
		gap: 20,
		flexDirection: 'row'
	},
	social: {
		gap: 10,
		borderRadius: 28,
		padding: Padding.sm,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		backgroundColor: Color.background
	},
	provider: {
		// display: 'none',
		fontSize: FontSize.base
	}
})