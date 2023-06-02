import _ from 'lodash'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Constants from 'expo-constants'
import { useRef, useState } from 'react'
import Toast from 'react-native-toast-message'
import * as ImagePicker from 'expo-image-picker'
import { Avatar, Button } from 'react-native-paper'
import { fetchSignInMethodsForEmail } from 'firebase/auth'
import { StackNavigationProp } from '@react-navigation/stack'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Animated, Dimensions, GestureResponderEvent, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import Input from '@/components/Input'
import { auth } from '@/utils/firebase'
import { AllowedScope } from '@/locales'
import { useStoreActions } from '@/store'
import { useI18n, useNavs } from '@/contexts/PreferencesContext'
import { Border, Color, FontFamily, FontSize, Padding } from 'globals'

interface ScreenProps {
	navigation: StackNavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const regex = /^0\d{9}$/
const { width } = Dimensions.get('screen')

export default ({ navigation }: ScreenProps) => {
	const { __ } = useI18n()
	const [avatar, setAvatar] = useState(null)
	const y = useRef(new Animated.Value(0)).current
	const register = useStoreActions(({ auth }) => auth.register)

	const animations = [
		{
			marginTop: y.interpolate({ inputRange: [0, 150 - 80], outputRange: [30, 0], extrapolate: 'clamp' }),
			transform: [{ scale: y.interpolate({ inputRange: [0, 150 - 80], outputRange: [1.5, 1], extrapolate: 'clamp' }) }]
		},
		{
			height: y.interpolate({ inputRange: [0, 150 - 80], outputRange: [150, 80], extrapolate: 'clamp' }),
			transform: [{ scale: y.interpolate({ inputRange: [0, 150 - 80], outputRange: [1, .8], extrapolate: 'clamp' }) }]
		}
	]

	const schema = Yup.object().shape({
		username: Yup.string()
			.meta({ icon: 'account'})
			.label(__('form.username'))
			.min(3, e => __('errors.min', e))
			.max(20, e => __('errors.max', e))
			.required(e => __('errors.required', e)),
		email: Yup.string()
			.meta({ icon: 'email'})
			.label(__('form.email'))
			.email(__('errors.email'))
			.required(e => __('errors.required', e))
			.test('unique', e => __('errors.unique', e), v => fetchSignInMethodsForEmail(auth, v).then(m => m.length === 0).catch(() => false)),
		phone: Yup.string()
			.meta({ icon: 'phone'})
			.label(__('form.phone'))
			.matches(regex, __('errors.phone'))
			.required(e => __('errors.required', e))
			.transform(v => v.replace(/\D/g, '')),
		password: Yup.string()
			.meta({ icon: 'lock'})
			.label(__('form.password'))
			.min(8, e => __('errors.min', e))
			.required(e => __('errors.required', e)),
		confirm: Yup.string()
			.meta({ icon: 'lock'})
			.label(__('form.confirm'))
			.required(e => __('errors.required', e))
			.is([Yup.ref('password')], __('errors.is', { is: __('form.password') }))
	})

	const errors = _.mapValues(schema.fields, () => '')
	const values: Record<keyof Yup.InferType<typeof schema>, string> = errors
	const inputs = Array.from({ length: _.keys(values).length }, () => useRef<TextInput>())
	const navs = useNavs(inputs)

	const pickImage = (mode: 'launchCameraAsync' | 'launchImageLibraryAsync') => ImagePicker.requestCameraPermissionsAsync().then(({ status }) => {
		if (status !== 'granted' && mode === 'launchCameraAsync') return Toast.show({ type: 'error', text1: __('grant.camera'), text2: __('grant.subtitle') })

		return ImagePicker[mode]({
			quality: 1,
			aspect: [1, 1],
			allowsEditing: true,
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			presentationStyle: ImagePicker.UIImagePickerPresentationStyle.POPOVER
		}).then((res: ImagePicker.ImagePickerResult) => {
			if (res.canceled) return
			if (!['jpeg', 'jpg', 'png'].includes(res.assets[0].uri.split('.')[1])) return Toast.show({ type: 'error', text1: __('errors.type.0'), text2: __('errors.type.1', { type: 'jpeg/jpg/png' }) })
			if (res.assets[0].fileSize >= 10 * 1024 ** 2) return Toast.show({ type: 'error', text1: __('errors.size.0'), text2: __('errors.size.1', { size: 10 }) })
			setAvatar(res.assets[0].uri)
		})
	})

	const onSubmit = ({ username, phone, email, password, confirm }) => {
		register({ avatar, username, phone, email, password, confirm })
			.then((res: AllowedScope[]) => {
				Toast.show({ text1: __(res[0]), text2: __(res[1]) })
				navigation.navigate('Login', { email })
			})
			.catch((err: AllowedScope[]) => Toast.show({ type: 'error', text1: __(err[0]), text2: __(err[1]) }))
	}

	return (
		<SafeAreaView style={styles.screen} onTouchStart={navs.dismiss}>
			<Animated.View style={[styles.avatar, animations[0]]}>
				<TouchableOpacity style={styles.preview} onPress={() => pickImage('launchImageLibraryAsync')} onLongPress={() => setAvatar(null)}>
					<Avatar.Image size={80} source={{ uri: avatar || Constants.manifest.icon }} />
				</TouchableOpacity>

				<TouchableOpacity style={styles.camera} onPress={() => avatar ? setAvatar(null) : pickImage('launchCameraAsync')}>
					<Avatar.Icon style={{ backgroundColor: avatar ? Color.danger : Color.primary }} size={24} icon={avatar ? 'close' : 'camera'} color={Color.white} />
				</TouchableOpacity>
			</Animated.View>

			<Animated.View style={[styles.header, animations[1]]}>
				<Text style={[styles.title, styles.typo]}>{__('register.title')}</Text>
				<Text style={[styles.subtitle, styles.typo]}>{__('register.subtitle')}</Text>
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
							{/* <Input ref={inputs[0]} navs={[0, navs]} autoFocus type="username" label={__('form.username')} left="account-outline" value={values.username} errors={[touched.username, errors.username]} onBlur={handleBlur('username')} onChangeText={handleChange('username')} />
							<Input ref={inputs[1]} navs={[1, navs]} type="email" label={__('form.email')} left="email-outline" value={values.email} errors={[touched.email, errors.email]} onBlur={handleBlur('email')} onChangeText={handleChange('email')} />
							<Input ref={inputs[2]} navs={[2, navs]} type="phone" label={__('form.phone')} left="phone-outline" value={values.phone} errors={[touched.phone, errors.phone]} onBlur={handleBlur('phone')} onChangeText={handleChange('phone')} />
							<Input ref={inputs[3]} navs={[3, navs]} type="password" label={__('form.password')} left="lock-outline" value={values.password} errors={[touched.password, errors.password]} onBlur={handleBlur('password')} onChangeText={handleChange('password')} />
							<Input ref={inputs[4]} navs={[4, navs]} type="password" label={__('form.confirm')} left="lock-outline" value={values.confirm} errors={[touched.confirm, errors.confirm]} onBlur={handleBlur('confirm')} onChangeText={handleChange('confirm')} returnKeyType="done" /> */}

							{/* Same thing as comment above */}
							{_.map(_.keys(values), (key: keyof typeof schema.fields, i) => <Input ref={inputs[i]} navs={[i, navs]} key={i} type={key} label={schema.fields[key].describe()?.['label']} left={schema.fields[key].describe()?.['meta']?.icon + '-outline' as any} value={values[key]} errors={[touched[key], errors[key]]} onBlur={handleBlur(key)} onChangeText={handleChange(key)} returnKeyType={i === _.keys(values).length - 1 ? 'done' : 'next'} /> )}

							<View style={styles.actions}>
								<TouchableOpacity disabled={!_.isEmpty(errors)} style={[styles.submit, !_.isEmpty(errors) && { backgroundColor: Color.border }]} onPress={handleSubmit as (e: GestureResponderEvent | React.FormEvent<HTMLFormElement> | undefined) => void}>
									<Button labelStyle={[styles.button, !_.isEmpty(errors) && { color: Color.body }]}>{__('register.submit')}</Button>
								</TouchableOpacity>

								<View style={styles.other}>
									<Text style={styles.text}>{__('register.other.0')}&nbsp;</Text>

									<TouchableOpacity onPress={() => navigation.navigate('Login')}>
										<Text style={[styles.typo, styles.link]}>{__('register.other.1')}</Text>
									</TouchableOpacity>
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
	avatar: {
		width: 'auto',
		height: 'auto',
		shadowOpacity: .5,
		alignSelf: 'center',
		alignItems: 'flex-end',
		shadowOffset: { width: 0, height: 2 }
	},
	preview: {
		alignSelf: 'center'
	},
	camera: {
		position: 'absolute'
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