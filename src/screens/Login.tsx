import React from 'react'
import _ from 'lodash'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Toast from 'react-native-toast-message'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, MD3Colors, TextInput } from 'react-native-paper'
import { Dimensions, GestureResponderEvent, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const iconApp = require('@/assets/ios/logo.png')
const { width, height } = Dimensions.get('screen')

const schema = Yup.object().shape({
	email: Yup.string().email().required(),
	password: Yup.string().min(8).required()
})

const values = { email: '', password: '' }

export default function Login({ navigation }) {
	const login = ({ email, password }) => Promise.resolve({ email, password })

	const onSubmit = ({email, password }, actions: any) => {
		login({ email, password })
			.then(res => Toast.show({ type: 'success', text1: 'Login Success', text2: JSON.stringify(res) }))
			.catch(err => setTimeout(() => Toast.show({ type: 'error', text1: 'Login Error', text2: JSON.stringify(err) }), 1000))
	}

	return (
		<SafeAreaView style={{ flex: 1 }} /* forceInset={{ top: 'always' }} */>
			<View style={styles.container}>
				<StatusBar barStyle="dark-content" />

				<View style={styles.logoContainer}>
					<Image style={styles.logo} source={iconApp} />
				</View>

				<View style={styles.innerContainer}>
					<Formik
						initialValues={values}
						initialErrors={values}
						validationSchema={schema}
						onSubmit={(values, actions) => onSubmit(values, actions)}
					>
						{({ handleChange, handleSubmit, handleBlur, values, errors, touched }) => (
							<>
								<View style={{ flexDirection: 'column', marginBottom: 10 }}>
									<TextInput
										style={styles.input}
										left={<TextInput.Icon icon={() => <Icon name="email" size={24} color={MD3Colors.neutral60} />} />}
										label="Email Address"
										placeholder="Email Address"
										autoComplete='email'
										keyboardType="email-address"
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
										left={<TextInput.Icon icon={() => (<Icon name="lock" size={24} color={MD3Colors.neutral60} />)} />}
										label="Mot de passe"
										placeholder="Mot de passe"
										secureTextEntry
										underlineColor={'#AB0000'}
										selectionColor={'#AB0000'}
										value={values.password.trim()}
										onChangeText={handleChange('password')}
										onBlur={handleBlur('password')}
									/>

									{errors.password && touched.password ? (<Text style={styles.errorValidation}>{errors.password}</Text>) : null}
								</View>

								<Button
									mode="contained"
									buttonColor={'#AB0000'}
									style={{ width: width / 1.3 }}
									contentStyle={{ width: '100%', padding: 8 }}
									onPress={handleSubmit as (values: GestureResponderEvent | React.FormEvent<HTMLFormElement> | undefined) => void}
									disabled={!_.isEmpty(errors)}
								>
									Login
								</Button>
							</>
						)}
					</Formik>
				</View>

				<View style={styles.footerContainer}>
					<TouchableOpacity onPress={() => navigation.navigate('Register')}>
						<Text style={styles.text}>Register</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
						<Text style={styles.text}>Forgot Password?</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	innerContainer: {
		flex: 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	footerContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		padding: 20
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
	text: {
		color: '#AB0000'
	},
	errorValidation: {
		color: MD3Colors.error50,
		fontSize: 10
	}
})