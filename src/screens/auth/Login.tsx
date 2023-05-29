import _ from 'lodash'
import * as Yup from 'yup'
import { useRef } from 'react'
import { Formik } from 'formik'
import Constants from 'expo-constants'
import Toast from 'react-native-toast-message'
import { Button, Switch } from 'react-native-paper'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { StackNavigationProp } from '@react-navigation/stack'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Animated, Dimensions, GestureResponderEvent, SafeAreaView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'

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
	const y = useRef(new Animated.Value(0)).current
	const login = useStoreActions(({ auth }) => auth.login)

	const animation = {
		height: y.interpolate({ inputRange: [0, 150 - 80], outputRange: [150, 80], extrapolate: 'clamp' }),
		transform: [{ scale: y.interpolate({ inputRange: [0, 150 - 80], outputRange: [1, .8], extrapolate: 'clamp' }) }]
	}

	const schema = Yup.object().shape({
		email: Yup.string()
			.meta({ icon: 'email'})
			.label(__('form.email'))
			.email(__('errors.email'))
			.required(e => __('errors.required', e)),
		password: Yup.string()
			.meta({ icon: 'lock'})
			.label(__('form.password'))
			.min(8, e => __('errors.min', e))
			.required(e => __('errors.required', e)),
		remember: Yup.boolean()
	})

	const errors = _.mapValues(schema.fields, () => '')
	const values: Record<keyof Yup.InferType<typeof schema>, string> = { ...errors, email: route.params?.email || '' }
	const inputs = Array.from({ length: _.keys(values).length }, () => useRef<TextInput>())
	const navs = useNavs(inputs)

	const onSubmit = ({ email, password, remember }) => {
		login({ email, password, remember: Boolean(remember) })
			.then((res: AllowedScope[]) => {
				Toast.show({ text1: __(res[0]), text2: __(res[1]) })
				navigation.replace('MainStack')
			})
			.catch((err: AllowedScope[]) => Toast.show({ type: 'error', text1: __(err[0]), text2: __(err[1]) }))
	}

	const signInWithGoogle = () => Toast.show({ text1: 'WIP Feature', text2: 'Signing with Google...' })
	const signInWithPhone = () => Toast.show({ text1: 'WIP Feature', text2: 'Signing with Phone...' })

	return (
		<SafeAreaView style={styles.screen} onTouchStart={navs.dismiss}>
			<Animated.View style={[styles.header, animation]}>
				<Text style={[styles.title, styles.typo]}>{__('login.title', { title: Constants.manifest.name })}</Text>
				<Text style={[styles.subtitle, styles.typo]}>{__('login.subtitle')}</Text>
			</Animated.View>

			<KeyboardAwareScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" scrollEventThrottle={16} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: false } )}>
				<Formik
					initialValues={values}
					initialErrors={errors}
					validationSchema={schema}
					onSubmit={(v: typeof values) => onSubmit(v)}
				>
					{({ handleChange, handleSubmit, handleBlur, setFieldValue, values, errors, touched }) => (
						<View style={styles.inputs}>
							<InputView ref={inputs[0]} navs={[0, navs]} autoFocus type="email" label={schema.fields['email'].describe()?.['label']} left={schema.fields['email'].describe()?.['meta']?.icon + '-outline' as any} value={values.email} errors={[touched.email, errors.email]} onBlur={handleBlur('email')} onChangeText={handleChange('email')} />

							<View style={styles.group}>
								<InputView ref={inputs[1]} navs={[1, navs]} type="password" label={schema.fields['password'].describe()?.['label']} left={schema.fields['password'].describe()?.['meta']?.icon + '-outline' as any} value={values.password} errors={[touched.password, errors.password]} onBlur={handleBlur('password')} onChangeText={handleChange('password')} returnKeyType="done" />

								<View style={styles.extras}>
									<View style={styles.remember}>
										<Switch color={Color.primary} value={Boolean(values.remember)} onValueChange={() => setFieldValue('remember', !values.remember)} />
										<Text style={styles.text}>{__('login.remember')}</Text>
									</View>

									<TouchableOpacity onPress={() => navigation.navigate('ForgotPassword', { email: values.email })}>
										<Text style={[styles.typo, styles.link]}>{__('login.forgot')}</Text>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.actions}>
								<TouchableOpacity disabled={!_.isEmpty(errors)} style={[styles.submit, !_.isEmpty(errors) && { backgroundColor: Color.border }]} onPress={handleSubmit as (e: GestureResponderEvent | React.FormEvent<HTMLFormElement> | undefined) => void}>
									<Button labelStyle={[styles.button, !_.isEmpty(errors) && { color: Color.body }]}>{__('login.submit')}</Button>
								</TouchableOpacity>

								<View style={styles.other}>
									<Text style={styles.text}>{__('login.other.0')}&nbsp;</Text>

									<TouchableOpacity onPress={() => navigation.navigate('Register')}>
										<Text style={[styles.typo, styles.link]}>{__('login.other.1')}</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					)}
				</Formik>

				<View style={styles.providers}>
					<View style={styles.divider}>
						<View style={styles.line} />
						<Text style={[styles.continue, styles.text]}>{__('login.continue')}</Text>
						<View style={styles.line} />
					</View>

					<View style={styles.socials}>
						<TouchableOpacity style={styles.social} onPress={signInWithGoogle}>
							<>
								<Icon name="google" size={24} color={Color.danger} />
								<Text style={[styles.provider, styles.text]}>Google</Text>
							</>
						</TouchableOpacity>

						<TouchableOpacity style={styles.social} onPress={signInWithPhone}>
							<>
								<Icon name="phone" size={24} color={Color.primary} />
								<Text style={[styles.provider, styles.text]}>Phone</Text>
							</>
						</TouchableOpacity>
					</View>
				</View>
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
	remember: {
		gap: 10,
		alignItems: 'center',
		flexDirection: 'row'
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
	},
	providers: {
		gap: 20,
		alignItems: 'center'
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
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'center'
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
		// display: 'none', // Toggle this to hide provider name
		fontSize: FontSize.base
	}
})