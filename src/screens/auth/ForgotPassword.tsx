import React from 'react'
import _ from 'lodash'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Constants from 'expo-constants'
import Toast from 'react-native-toast-message'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, IconButton, MD3Colors, TextInput } from 'react-native-paper'
import { Dimensions, GestureResponderEvent, Image, StatusBar, StyleSheet, Text, View } from 'react-native'

const { width, height } = Dimensions.get('screen')

const schema = Yup.object().shape({
	email: Yup.string().email().required()
})

const values = { email: '' } 

export default function ForgotPassword({ navigation }) {
	const recoverPassword = ({ email }) => Promise.resolve({ email })

	const onSubmit = ({ email }, actions: any) => {
		recoverPassword({ email })
			.then(res => Toast.show({ type: 'success', text1: 'Recovery Password Success', text2: JSON.stringify(res) }))
			.catch(err => console.log(err))
	}

	return (
		<SafeAreaView style={{ flex: 1 }} /* forceInset={{ top: 'always' }} */>
			<View style={styles.container}>
				<StatusBar barStyle="dark-content" />

				<View style={styles.logoContainer}>
					<Image style={styles.logo} source={{ uri: Constants.manifest.icon }} />
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
										keyboardType="email-address"
										autoCapitalize="none"
										underlineColor={'#AB0000'}
										selectionColor={'#AB0000'}
										value={values.email.trim()}
										onChangeText={handleChange('email')}
										onBlur={handleBlur('email')}
									/>

									{errors.email && touched.email ? <Text style={styles.errorValidation}>{errors.email}</Text> : null}
								</View>

								<Button
									mode="contained"
									buttonColor={'#AB0000'}
									style={{ width: width / 1.3, marginBottom: 30 }}
									contentStyle={{ width: '100%', padding: 8 }}
									onPress={handleSubmit as (values: GestureResponderEvent | React.FormEvent<HTMLFormElement> | undefined) => void}
									disabled={!_.isEmpty(errors)} // Si il y'a des erreurs on désactive
								>
									Send
								</Button>
							</>
						)}
					</Formik>

					<IconButton
						icon="arrow-left"
						iconColor={'#AB0000'}
						size={32}
						onPress={() => navigation.goBack()}
					/>
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
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
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