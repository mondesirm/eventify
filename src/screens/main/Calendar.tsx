import _ from 'lodash'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Toast from 'react-native-toast-message'
import BottomSheet from '@gorhom/bottom-sheet'
import { NavigationProp } from '@react-navigation/native'
import { Agenda, DateData } from 'react-native-calendars'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { AnimatedFAB, Badge, Button, IconButton, MD3Colors } from 'react-native-paper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Animated, Dimensions, GestureResponderEvent, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import Input from '@/components/Input'
import { AllowedScope } from '@/locales'
import { Event, useStoreActions, useStoreState } from '@/store'
import { useI18n, useNavs } from '@/contexts/PreferencesContext'
import { Border, Color, FontFamily, FontSize, Padding } from 'globals'

interface ScreenProps {
	navigation: NavigationProp<any, any>
	route: { key: string, name: string, params: any }
}

const { width, height } = Dimensions.get('screen')

export default function Calendar({ navigation, route }: ScreenProps) {
	const { __, locale } = useI18n()
	const [index, setIndex] = useState(-1)
	const bottomSheet = useRef<BottomSheet>(null)
	const y = useRef(new Animated.Value(0)).current
	const bottomTabBarHeight = useBottomTabBarHeight()
	const snapPoints = useMemo(() => ['25%', '50%', '90%'], [])
	// const create = useStoreActions(({ calendar }) => calendar.create)
	const items = useStoreState(({ calendar }) => calendar.items) as any
	const loadItems = useStoreActions(({ calendar }) => calendar.loadItems)
	const handleClosePress = useCallback(() => { bottomSheet.current?.close() }, [])
	const handleSnapPress = useCallback((i: number) => { bottomSheet.current?.snapToIndex(i) }, [])

	const animation = {
		height: y.interpolate({ inputRange: [0, 150 - 80], outputRange: [150, 80], extrapolate: 'clamp' }),
		transform: [{ scale: y.interpolate({ inputRange: [0, 150 - 80], outputRange: [1, .8], extrapolate: 'clamp' }) }]
	}

	const schema = Yup.object().shape({
		title: Yup.string()
			.meta({ icon: 'format-text-variant-outline'})
			.label(__('entities.event.title'))
			.min(3, e => __('errors.min', e))
			.max(50, e => __('errors.max', e))
			.required(e => __('errors.required', e)),
		description: Yup.string()
			.meta({ icon: 'text-box-outline'})
			.label(__('entities.event.description'))
			.max(500, e => __('errors.max', e)),
		start: Yup.date()
			.meta({ icon: 'calendar-start'})
			.label(__('entities.event.start'))
			.min(new Date(), e => __('errors.minDate', { min: new Date(e.min).toLocaleDateString(locale, { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }))
			.required(e => __('errors.required', e)),
			// Parse date to Timestamp with transform
		end: Yup.date()
			.meta({ icon: 'calendar-end'})
			.label(__('entities.event.end'))
			// must be greater than start
			.min(Yup.ref('start'), e => __('errors.minDate', { min: new Date(e.min).toLocaleDateString(locale, { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) })),
		limit: Yup.number()
			.meta({ icon: 'account-multiple-outline'})
			.label(__('entities.event.limit'))
			.min(2, e => __('errors.min', e)),
		visibility: Yup.string()
			.meta({ icon: 'eye-outline'})
			.label(__('entities.event.visibility'))
			.oneOf(['public', 'friends', 'unlisted'], e => __('errors.oneOf', e))
			.required(e => __('errors.required', e)),
		place: Yup.string()
			.meta({ icon: 'map-marker-outline'})
			.label(__('entities.event.place'))
			.min(2, e => __('errors.min', e)),
		category: Yup.string()
			.meta({ icon: 'tag-text-outline'})
			.label(__('entities.event.category'))
			.min(2, e => __('errors.min', e))
	})

	const errors = _.mapValues(schema.fields, () => '')
	const values: Record<keyof Yup.InferType<typeof schema>, string> = { ...errors, start: new Date().toISOString(), end: new Date().toISOString() }
	const inputs = Array.from({ length: _.keys(values).length }, () => useRef<TextInput>())
	const navs = useNavs(inputs)

	const randomColor = (name: string | null = null) => {
		if (!name) return 'transparent'
		return `#${((parseInt(name, 36) * 2) % 0xffffff).toString(16)}000000`.slice(0, 7)
	}

	const rowHasChanged: typeof Agenda.prototype.props.rowHasChanged = (r1, r2) => r1.name !== r2.name

	const renderEmptyDate: typeof Agenda.prototype.props.renderEmptyDate = () => (
		<View style={styles.emptyDate}>
			<Text>Nothing there!</Text>
		</View>
	)

	const renderItem = (item: any) => {
		let event = item as Event<true>

		return (
			<View style={styles.item}>
				<View>
					<Text style={{ color: '#48506B', fontFamily: FontFamily.medium, marginBottom: 10 }}>{event.title}</Text>
					<Text style={{ color: '#9B9B9B', fontFamily: FontFamily.medium }}>
						{event.start.toDate().toLocaleDateString(locale, { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
						{event?.end && !event.start.isEqual(event.end) && ' • ' + event.end.toDate().toLocaleDateString(locale, { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
					</Text>
				</View>

				<Badge style={[styles.badge, { backgroundColor: randomColor(event.category?.name) }]}>{event.category?.name}</Badge>
			</View>
		)
	}

	const loadItemsForMonth = (data: DateData) => {
		loadItems(data)
			// .then((res: AllowedScope[]) => {
			// 	Toast.show({ text1: __(res[0]), text2: __(res[1]) })
			// 	navigation.navigate('Login', { email })
			// })
			.catch((err: AllowedScope[]) => Toast.show({ type: 'error', text1: __(err[0]), text2: __(err[1]) }))
	}

	const onChange = (event: DateTimePickerEvent, selectedDate: Date, setter: Function) => setter(selectedDate.toISOString())

	const onSubmit = ({ title, description, start, end, limit, visibility, place, category }) => {
		// create({ title, description, start, end, limit, visibility, place, category })
		// 	.then((res: AllowedScope[]) => {
		// 		Toast.show({ text1: __(res[0]), text2: __(res[1]) })
		// 		handleClosePress()
		// 	})
		// 	.catch((err: AllowedScope[]) => Toast.show({ type: 'error', text1: __(err[0]), text2: __(err[1]) }))
	}

	return (
		<SafeAreaView style={[styles.screen, { height: height - bottomTabBarHeight }]} onTouchStart={navs.dismiss}>
			<Agenda
				// style={{ paddingBottom: 20 }}
				firstDay={1}
				items={items}
				enableSwipeMonths
				renderItem={renderItem}
				rowHasChanged={rowHasChanged}
				loadItemsForMonth={loadItemsForMonth}
				renderEmptyDate={renderEmptyDate}
				// refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
				theme={{
					dotColor: Color.primary,
					backgroundColor: '#F1F1F8',
					agendaTodayColor: '#4F44B6',
					agendaDayNumColor: Color.primary,
					agendaDayTextColor: Color.primary,
					selectedDayBackgroundColor: Color.primary
				}}
			/>

			<AnimatedFAB style={styles.fab} icon="plus" label="Create Event" extended onPress={() => handleSnapPress(2)} />

			<BottomSheet ref={bottomSheet} style={[styles.sheet, { shadowRadius: index * 10 }]} index={index} snapPoints={snapPoints} enablePanDownToClose onChange={setIndex} onClose={() => Keyboard.dismiss()}>
				<SafeAreaView style={styles.modal}>
					<IconButton style={styles.close} icon="close" iconColor={Color.black} onPress={() => handleClosePress()} />

					<Animated.View style={[styles.header, animation]}>
						<Text style={[styles.title, styles.typo]}>{__('entities.event.new')}</Text>
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
									<Input ref={inputs[0]} navs={[0, navs]} autoFocus={index > -1} label={schema.fields['title'].describe()?.['label']} left={schema.fields['title'].describe()?.['meta']?.icon as any} value={values.title} errors={[touched.title, errors.title]} onBlur={handleBlur('title')} onChangeText={handleChange('title')} />
									<Input ref={inputs[1]} navs={[1, navs]} label={schema.fields['description'].describe()?.['label']} left={schema.fields['description'].describe()?.['meta']?.icon as any} value={values.description} errors={[touched.description, errors.description]} enablesReturnKeyAutomatically={false} onBlur={handleBlur('description')} onChangeText={handleChange('description')} />

									<View>
										<View style={styles.group}>
											<Text style={[styles.text, styles.typo]}>{schema.fields['start'].describe()?.['label']}</Text>
											<DateTimePicker mode="date" value={new Date(values.start)} is24Hour onChange={(e, s) => onChange(e, s, handleChange('start'))} />
											<DateTimePicker mode="time" value={new Date(values.start)} is24Hour onChange={(e, s) => onChange(e, s, handleChange('start'))} />
										</View>

										{touched.start && errors.start && <Text style={styles.error}>{errors.start.charAt(0).toUpperCase() + errors.start.slice(1).toLowerCase()}.</Text>}
									</View>

									<View>
										<View style={styles.group}>
											<Text style={[styles.text, styles.typo]}>{schema.fields['end'].describe()?.['label']}</Text>
											<DateTimePicker mode="date" value={new Date(values.end)} is24Hour onChange={(e, s) => onChange(e, s, handleChange('end'))} />
											<DateTimePicker mode="time" value={new Date(values.end)} is24Hour onChange={(e, s) => onChange(e, s, handleChange('end'))} />
										</View>

										{touched.end && errors.end && <Text style={styles.error}>{errors.end.charAt(0).toUpperCase() + errors.end.slice(1).toLowerCase()}.</Text>}
									</View>

									<Input ref={inputs[4]} navs={[2, navs]} type="number" label={schema.fields['limit'].describe()?.['label']} left={schema.fields['limit'].describe()?.['meta']?.icon as any} value={values.limit} errors={[touched.limit, errors.limit]} enablesReturnKeyAutomatically={false} onBlur={handleBlur('limit')} onChangeText={handleChange('limit')} />
									<Input ref={inputs[5]} navs={[3, navs]} label={schema.fields['visibility'].describe()?.['label']} left={schema.fields['visibility'].describe()?.['meta']?.icon as any} value={values.visibility} errors={[touched.visibility, errors.visibility]} onBlur={handleBlur('visibility')} onChangeText={handleChange('visibility')} />
									<Input ref={inputs[6]} navs={[4, navs]} label={schema.fields['place'].describe()?.['label']} left={schema.fields['place'].describe()?.['meta']?.icon as any} value={values.place} errors={[touched.place, errors.place]} enablesReturnKeyAutomatically={false} onBlur={handleBlur('place')} onChangeText={handleChange('place')} />
									<Input ref={inputs[7]} navs={[5, navs]} label={schema.fields['category'].describe()?.['label']} left={schema.fields['category'].describe()?.['meta']?.icon as any} value={values.category} errors={[touched.category, errors.category]} enablesReturnKeyAutomatically={false} onBlur={handleBlur('category')} onChangeText={handleChange('category')} />

									<View style={styles.actions}>
										<TouchableOpacity disabled={!_.isEmpty(errors)} style={[styles.submit, !_.isEmpty(errors) && { backgroundColor: Color.border }]} onPress={handleSubmit as (e: GestureResponderEvent | React.FormEvent<HTMLFormElement> | undefined) => void}>
											<Button labelStyle={[styles.button, !_.isEmpty(errors) && { color: Color.body }]}>{__('form.save')}</Button>
										</TouchableOpacity>
									</View>
								</View>
							)}
						</Formik>
					</KeyboardAwareScrollView>

					{navs.fabs()}
				</SafeAreaView>
			</BottomSheet>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	screen: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Color.white
	},
	content: {
		gap: 32,
		paddingHorizontal: 20
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
	fab: {
		bottom: 0,
		right: 0,
		margin: 16,
		borderRadius: 28,
		// position: 'absolute',
		backgroundColor: Color.white
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Color.white // no whiteTwo?
	},
	item: {
		padding: 10,
		marginTop: 10,
		marginRight: 10,
		borderRadius: 5,
		flexDirection: 'row',
		backgroundColor: 'white',
		justifyContent: 'space-between'
	},
	badge: {
		color: Color.white,
		paddingHorizontal: 10,
		fontSize: FontSize.x2s,
		textTransform: 'uppercase',
		backgroundColor: Color.primary,
		fontFamily: FontFamily.semiBold
	},
	emptyDate: {
		flex: 1,
		height: 15,
		paddingTop: 30
	},
	sheet: {
		elevation: 5,
		shadowOffset: {
			width: 0,
			height: 10
		},
		shadowRadius: 10,
		shadowOpacity: 1,
		shadowColor: '#000'
	},
	close: {
		top: 0,
		right: 0,
		position: 'absolute'
	},
	modal: {
		...StyleSheet.absoluteFillObject,
		marginBottom: 24,
		borderTopLeftRadius: Border.xl,
		borderTopRightRadius: Border.xl
	},
	header: {
		justifyContent: 'center'
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
		gap: 30,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	error: {
		bottom: -20,
		fontSize: 10,
		position: 'absolute',
		color: MD3Colors.error50 // TODO Color.danger
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