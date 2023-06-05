import * as Haptics from 'expo-haptics'
import { useEffect, useRef, useState } from 'react'
import { NavigationProp } from '@react-navigation/native'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { IconButton, Text, TextInput, TextInputProps } from 'react-native-paper'
import { Animated, I18nManager, InputAccessoryView, Keyboard, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

import { Color, FontFamily, FontSize } from 'globals'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const isAndroidRTL = I18nManager.isRTL && Platform.OS === 'android'

type MessageProps = {
	text?: string
	color?: string,
	other?: boolean
}

const Message = ({ text = 'Message', color = Color.primary, other = false }: MessageProps) => (
	<View style={[styles.message, other && { backgroundColor: Color.border, alignSelf: 'flex-start' }]}>
		<Text style={[styles.text, other && { color: Color.black }]}>{text}</Text>
		{/* add a little tail to the message */}
		{/* <View style={[styles.tail, other && { backgroundColor: Color.border, left: -10 }]} /> */}
	</View>
)

interface TextInputBarProps extends TextInputProps {
	onPressRight?: () => void
}

const TextInputBar = (props: TextInputBarProps) => {
	const [action, setAction] = useState(null)
	const [typing, setTyping] = useState(false)
	let value = useRef(new Animated.Value(1)).current

	const animation = {
		width: value.interpolate({ inputRange: [0, 1], outputRange: [40, 0], extrapolate: 'clamp' }),
		height: value.interpolate({ inputRange: [0, 1], outputRange: [40, 0], extrapolate: 'clamp' }),
		marginLeft: value.interpolate({ inputRange: [0, 1], outputRange: [0, -8], extrapolate: 'clamp' }),
		opacity: value.interpolate({ inputRange: [0, 1], outputRange: [1, 0], extrapolate: 'clamp' }),
		transform: [{ translateX: value.interpolate({ inputRange: [0, 1], outputRange: [0, 40], extrapolate: 'clamp' }) }],
		backgroundColor: value.interpolate({ inputRange: [0, 1], outputRange: [Color.primary, Color.chat.input], extrapolate: 'clamp' })
	}

	useEffect(() => {
		const listener = Keyboard.addListener('keyboardWillHide', () => setAction(null))
		return () => listener.remove()
	}, [])

	useEffect(() => {
		if (props.value) !typing && slideIn(() => setTyping(true))
		else slideOut(() => setTyping(false))
	}, [props.value])

	useEffect(() => { if (action) Haptics.selectionAsync() }, [action])

	const slideIn = (f = () => {}) => Animated.timing(value, { toValue: 0, duration: 200, useNativeDriver: false }).start(f)
	const slideOut = (f = () => {}) => Animated.timing(value, { toValue: 1, duration: 200, useNativeDriver: false }).start(f)

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.icon} onPress={() => action === 'plus' ? setAction('close') : setAction('plus')}>
				<Icon name={action === 'plus' ? 'close' : 'plus'} size={24} color={Color.chat.icon} />
			</TouchableOpacity>

			<TouchableOpacity style={styles.icon} onPress={() => action === 'gift' ? setAction('gift-open') : setAction('gift')}>
				<Icon name={action === 'gift' ? 'gift-open' : 'gift'} size={24} color={Color.chat.icon} />
			</TouchableOpacity>

			<TextInput
				{...props}
				dense
				multiline
				maxLength={100}
				numberOfLines={4}
				mode="outlined"
				contentStyle={{ marginVertical: -5 }}
				outlineStyle={styles.outline}
				style={styles.input}
				activeOutlineColor={Color.primary}
				placeholderTextColor={Color.body}
				enablesReturnKeyAutomatically
				value={props.value}
				onChangeText={props.onChangeText}
				placeholder="Message John DOE"
				right={<TextInput.Icon icon="emoticon" color={() => Color.chat.icon} onPress={props.onPressRight} />}
			/>

			<Animated.View style={[styles.icon, animation]}>
				{/* <IconButton icon={props.value ? 'send' : 'microphone'} size={24} iconColor={props.value ? Color.white : Color.chat.icon} /> */}
				<IconButton icon="send" size={24} iconColor={props.value ? Color.white : Color.chat.icon} />
			</Animated.View>
		</View>
	)
}

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

export default function Chat({ navigation }: ScreenProps) {
	const [text, setText] = useState('')
	const y = useRef(new Animated.Value(0)).current
	const [messages, setMessages] = useState(Array(5).fill('Message'))

	const animation =  {
		height: y.interpolate({ inputRange: [0, 1], outputRange: [100, 50], extrapolate: 'clamp' }),
		// opacity: y.interpolate({ inputRange: [0, 100 - 50], outputRange: [1, 0], extrapolate: 'clamp' })
	}

	return (
		<SafeAreaView style={styles.screen}>
			<Animated.View style={[styles.header, animation]}>
				<Text style={[styles.title, styles.typo]}>Contact Name</Text>
				{/* <Text style={[styles.subtitle, styles.typo]}>Online Status</Text> */}
			</Animated.View>

			<KeyboardAwareScrollView ref={ref => ref?.scrollToEnd(false)} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" scrollEventThrottle={16} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: false } )}>
				{messages.map((_, i) => <Message other={Boolean(Math.round(Math.random()))} key={i} text={Math.random().toString()} />)}
			</KeyboardAwareScrollView>

			<InputAccessoryView backgroundColor={Color.white}>
				<TextInputBar value={text} onChangeText={setText} onPressRight={() => setMessages([...messages, text])} />
			</InputAccessoryView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: {
		flexGrow: 1,
		backgroundColor: Color.primary
	},
	header: {
		gap: 16,
		justifyContent: 'center'
	},
	typo: {
		color: Color.white,
		fontWeight: '500',
		textAlign: 'center',
		fontFamily: FontFamily.medium
	},
	title: {
		fontSize: FontSize.x2l,
		textTransform: 'capitalize'
	},
	subtitle: {
		fontSize: FontSize.sm
	},
	scroll: {
		flexGrow: 1,
		// ...StyleSheet.absoluteFillObject,
		paddingBottom: 4,
		backgroundColor: Color.white
	},
	message: {
		margin: 20,
		maxWidth: '70%',
		borderRadius: 20,
		alignSelf: 'flex-end',
		backgroundColor: Color.primary,
        // borderRightWidth: 20,
        // borderBottomWidth: 20,
        // borderBottomColor: 'white',
        // borderRightColor: 'transparent',
	},
	text: {
		padding: 10,
		color: 'white'
	},
	tail: {
		position: 'absolute',
		width: 20,
		height: 20,
		bottom: -10,
		right: -10,
		borderRadius: 4,
		backgroundColor: Color.primary,
		transform: [{ rotate: '45deg' }]
	},
	fill: {
		flex: 1,
	},
	container: {
		gap: 8,
		// left: 20,
		// right: 20,
		minHeight: 58,
		borderTopWidth: 1,
		paddingVertical: 6,
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 8,
		borderTopColor: '#eee'
	},
	outline: {
		// height: 40,
		borderWidth: 0,
		borderRadius: 30,
		backgroundColor: Color.chat.input,
		textAlign: isAndroidRTL ? 'right' : 'left'
	},
	input: {
		flex: 1,
		marginTop: -5,
		maxHeight: 67 + 40,
		fontSize: FontSize.sm,
		// alignItems: 'center',
		alignSelf: 'center',
		// alignContent: 'center',
		textAlign: isAndroidRTL ? 'right' : 'left',
		justifyContent: 'space-between'
	},
	icon: {
		width: 40,
		height: 40,
		// padding: 10,
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Color.chat.input
	}
})