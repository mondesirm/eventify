import React from 'react'
import _ from 'lodash'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Constants from 'expo-constants'
import Toast from 'react-native-toast-message'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, IconButton, TextInput, MD3Colors } from 'react-native-paper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Alert, Dimensions, GestureResponderEvent, Image, StatusBar, StyleSheet, Text, View } from 'react-native'

const { width, height } = Dimensions.get('screen')
const regexPhoneFrance = /(^[0]){1}([0-9]{9})/

const schema = Yup.object().shape({
	firstName: Yup.string().min(2).required(),
	lastName: Yup.string().min(2).required(),
	phoneNumber: Yup.string()
		.matches(regexPhoneFrance)
		.max(10)
		.required(),
	email: Yup.string().email().required(),
	password: Yup.string().min(8).required(),
	confirmPassword: Yup.string()
		.required()
		.oneOf([Yup.ref('password')])
})

// schema to JSON object
// const values = _.mapValues(_.mapValues(schema.fields, 'default'), (v, k) => '')

const values = {
	lastName: '',
	firstName: '',
	phoneNumber: '',
	email: '',
	password: '',
	confirmPassword: ''
}

export default function Register({ navigation }) {
	const register = ({ firstName, lastName, phoneNumber, email, password, confirmPassword }) => Promise.resolve({ firstName, lastName, phoneNumber, email, password, confirmPassword })

	const onSubmit = ({ firstName, lastName, phoneNumber, email, password, confirmPassword }, actions: any) => {
		register({ firstName, lastName, phoneNumber, email, password, confirmPassword })
			.then(res => {
				Toast.show({ type: 'success', text1: 'Register Success', text2: JSON.stringify(res) })
				navigation.goBack()
			})
			.catch(err => setTimeout(() => Alert.alert('Erreur', err.message, null, { cancelable: false }), 200))
	}

	return (
		<SafeAreaView style={{ flex: 1 }} /* forceInset={{ top: 'always' }} */>
			<View style={styles.container}>
				<StatusBar barStyle="dark-content" />

				<View style={styles.logoContainer}>
					<Image style={styles.logo} source={{ uri: Constants.manifest.icon }} />
				</View>

				<Formik
					initialValues={values}
					initialErrors={values}
					validationSchema={schema}
					onSubmit={(values, actions) => onSubmit(values, actions)}
				>
					{({ handleChange, handleSubmit, handleBlur, values, errors, touched }) => (
						<KeyboardAwareScrollView
							style={{ width: '100%' }}
							contentContainerStyle={{ alignItems: 'center' }}
							keyboardShouldPersistTaps="always"
						>
							<View style={{ flexDirection: 'column', marginBottom: 10 }}>
								<TextInput
									style={styles.input}
									left={<TextInput.Icon icon={() => <Icon name="account" size={24} color={MD3Colors.neutral60} />} />}
									label="First Name"
									placeholder="First Name"
									autoCapitalize="words"
									autoComplete='name-given'
									underlineColor={'#AB0000'}
									selectionColor={'#AB0000'}
									value={values.firstName.trim()}
									onChangeText={handleChange('firstName')}
									onBlur={handleBlur('firstName')}
								/>

								{errors.firstName && touched.firstName ? <Text style={styles.errorValidation}>{errors.firstName}</Text> : null}
							</View>

							<View style={{ flexDirection: 'column', marginBottom: 10 }}>
								<TextInput
									style={styles.input}
									left={<TextInput.Icon icon={() => <Icon name="account" size={24} color={MD3Colors.neutral60} />} />}
									label="Last Name"
									placeholder="Last Name"
									autoCapitalize="words"
									autoComplete='name-family'
									underlineColor={'#AB0000'}
									selectionColor={'#AB0000'}
									value={values.lastName.trim()}
									onChangeText={handleChange('lastName')}
									onBlur={handleBlur('lastName')}
								/>

								{errors.lastName && touched.lastName ? <Text style={styles.errorValidation}>{errors.lastName}</Text> : null}
							</View>

							<View style={{ flexDirection: 'column', marginBottom: 10 }}>
								<TextInput
									style={styles.input}
									left={<TextInput.Icon icon={() => <Icon name="cellphone" size={24} color={MD3Colors.neutral60} />} />}
									label="Phone Number"
									placeholder="Phone Number"
									autoCapitalize="none"
									autoComplete='tel'
									underlineColor={'#AB0000'}
									selectionColor={'#AB0000'}
									value={values.phoneNumber.trim()}
									onChangeText={handleChange('phoneNumber')}
									onBlur={handleBlur('phoneNumber')}
								/>

								{errors.phoneNumber && touched.phoneNumber ? <Text style={styles.errorValidation}>{errors.phoneNumber}</Text> : null}
							</View>

							<View style={{ flexDirection: 'column', marginBottom: 10 }}>
								<TextInput
									style={styles.input}
									left={<TextInput.Icon icon={() => <Icon name="email" size={24} color={MD3Colors.neutral60} />} />}
									label="Email Address"
									placeholder="Email Address"
									keyboardType="email-address"
									autoCapitalize="none"
									autoComplete='email'
									underlineColor={'#AB0000'}
									selectionColor={'#AB0000'}
									value={values.email.trim()}
									onChangeText={handleChange('email')}
									onBlur={handleBlur('email')}
								/>

								{errors.email && touched.email ? <Text style={styles.errorValidation}>{errors.email}</Text> : null}
							</View>

							<View style={{ flexDirection: 'column', marginBottom: 10 }}>
								<TextInput
									style={styles.input}
									left={<TextInput.Icon icon={() => <Icon name="lock" size={24} color={MD3Colors.neutral60} />} />}
									label="Password"
									placeholder="Password"
									autoCapitalize="none"
									secureTextEntry
									underlineColor={'#AB0000'}
									selectionColor={'#AB0000'}
									value={values.password.trim()}
									onChangeText={handleChange('password')}
									onBlur={handleBlur('password')}
								/>

								{errors.password && touched.password ? <Text style={styles.errorValidation}>{errors.password}</Text> : null}
							</View>

							<View style={{ flexDirection: 'column', marginBottom: 10 }}>
								<TextInput
									style={styles.input}
									left={<TextInput.Icon icon={() => <Icon name="lock" size={24} color={MD3Colors.neutral60} />} />}
									label="Password Confirmation"
									placeholder="Password Confirmation"
									autoCapitalize="none"
									secureTextEntry
									underlineColor={'#AB0000'}
									selectionColor={'#AB0000'}
									value={values.confirmPassword.trim()}
									onChangeText={handleChange('confirmPassword')}
									onBlur={handleBlur('confirmPassword')}
								/>

								{errors.confirmPassword && touched.confirmPassword ? <Text style={styles.errorValidation}>{errors.confirmPassword}</Text> : null}
							</View>

							<Button
								mode="contained"
								buttonColor={'#AB0000'}
								style={{ width: width / 1.3, marginBottom: 30 }}
								contentStyle={{ width: '100%', padding: 8 }}
								onPress={handleSubmit as (values: GestureResponderEvent | React.FormEvent<HTMLFormElement> | undefined) => void}
								disabled={!_.isEmpty(errors)}
							>
								Register
							</Button>

							<IconButton
								icon="arrow-left"
								iconColor={'#AB0000'}
								size={32}
								onPress={() => navigation.goBack()}
							/>
						</KeyboardAwareScrollView>
					)}
				</Formik>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	logoContainer: {
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginVertical: 10
	},
	logo: {
		width: '100%',
		height: 100,
		resizeMode: 'contain'
	},
	input: {
		width: width / 1.3,
		height: height / 14,
		backgroundColor: '#fff'
	},
	errorValidation: {
		color: MD3Colors.error50,
		fontSize: 10
	}
})