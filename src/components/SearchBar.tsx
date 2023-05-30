import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'

import Icons from '@/icons'
import { Border, Color, Padding } from 'globals'
import { useI18n } from '@/contexts/PreferencesContext'
import InputView, { InputViewProps } from '@/components/InputView'

const { width } = Dimensions.get('window')

export default (props: InputViewProps) => {
	const { __ } = useI18n()

	return (
		<View style={[styles.group, props.style]}>
			{/* <View style={[styles.box]}>
				<Icons.Location set="light" primaryColor={Color.black} />
				<Text style={styles.text}>Search...</Text>

				<View style={{ flexDirection: 'row' }}>
					<Icons.Discovery set="light" primaryColor={Color.body} />
				</View>
			</View> */}

			<InputView style={[styles.box, styles.bar]} {...props} type="search" placeholder={__('form.search')} left="location" right="discovery" value={props.value} onBlur={props.onBlur} onChangeText={props.onChangeText} />

			<TouchableOpacity style={[styles.box, styles.button]}>
				<Icons.Search />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	group: {
		gap: 20,
		width: width - 40,
		alignItems: 'center',
		flexDirection: 'row'
	},
	box: {
		shadowOffset: {
			width: 0,
			height: 24
		},
		shadowRadius: 10,
		shadowOpacity: 1,
		shadowColor: '#0002',
		borderRadius: Border.x3s,
		backgroundColor: Color.white
	},
	bar: {
		flex: 1,
		padding: 4,
		marginTop: -5
	},
	button: {
		padding: Padding.base
	},
})