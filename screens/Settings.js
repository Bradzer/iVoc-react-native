// /* eslint-disable react/prop-types */
/* global require */

import React from "react";
import {
	StyleSheet,
	View,
	Text,
	ToastAndroid,
	ScrollView,
	Dimensions,
	BackHandler,
} from "react-native";
import {
	Icon,
	CheckBox,
	Input,
	ButtonGroup,
	Button,
	Divider
} from "react-native-elements";
import firebase from "react-native-firebase";
import { inject, observer } from "mobx-react";
import { NavigationEvents } from 'react-navigation';
import PropTypes from 'prop-types';

import SettingsOverflowMenu from "../fragments/SettingsOverflowMenu";
import AppConstants from "../constants/Constants";
import Strings from '../constants/Strings'
import Toasts from '../constants/Toasts'
import BanTypes from '../constants/BanTypes'

const firebaseAuth = firebase.auth()
let userId = null
let userWordsDetailsCollection = null
const blackListCollection = firebase.firestore().collection('blacklist')

const Realm = require("realm");

const _ = require("lodash");

class Settings extends React.Component {

	store = this.props.store;

	static navigationOptions = ({ navigation }) => {
		return {
			headerTitle: Strings.STRING_SETTINGS,
			tabBarLabel: Strings.STRING_TAB_SETTINGS,
			tabBarIcon: <Icon name='settings' />,
			headerStyle: {
				backgroundColor: AppConstants.APP_PRIMARY_COLOR
			},
			headerTintColor: AppConstants.COLOR_WHITE,
			headerRight: <SettingsOverflowMenu navigation={navigation} />
		};
	};

	partOfSpeechAll = () => (
		<Text
			style={{
				fontWeight: "bold",
				fontStyle:
					this.store.selectedPartOfSpeechIndex ===
					AppConstants.PART_OF_SPEECH_ALL_INDEX
						? "italic"
						: "normal"
			}}
		>
			{Strings.STRING_ALL}
		</Text>
	);
	partOfSpeechVerb = () => (
		<Text
			style={{
				fontWeight: "bold",
				fontStyle:
					this.store.selectedPartOfSpeechIndex ===
					AppConstants.PART_OF_SPEECH_VERB_INDEX
						? "italic"
						: "normal"
			}}
		>
			{Strings.STRING_VERB}
		</Text>
	);
	partOfSpeechNoun = () => (
		<Text
			style={{
				fontWeight: "bold",
				fontStyle:
					this.store.selectedPartOfSpeechIndex ===
					AppConstants.PART_OF_SPEECH_NOUN_INDEX
						? "italic"
						: "normal"
			}}
		>
			{Strings.STRING_NOUN}
		</Text>
	);
	partOfSpeechAdjective = () => (
		<Text
			style={{
				fontWeight: "bold",
				fontStyle:
					this.store.selectedPartOfSpeechIndex ===
					AppConstants.PART_OF_SPEECH_ADJECTIVE_INDEX
						? "italic"
						: "normal"
			}}
		>
			{Strings.STRING_ADJECTIVE}
		</Text>
	);
	partOfSpeechAdverb = () => (
		<Text
			style={{
				fontWeight: "bold",
				fontStyle:
					this.store.selectedPartOfSpeechIndex ===
					AppConstants.PART_OF_SPEECH_ADVERB_INDEX
						? "italic"
						: "normal"
			}}
		>
			{Strings.STRING_ADVERB}
		</Text>
	);

	render() {
		const buttons = [
			{ element: this.partOfSpeechAll },
			{ element: this.partOfSpeechVerb },
			{ element: this.partOfSpeechNoun },
			{ element: this.partOfSpeechAdjective },
			{ element: this.partOfSpeechAdverb }
		];

		return (
			<View style={styles.container}>
				<NavigationEvents
					onDidFocus={() => this.onDidFocus()}
					onWillBlur={() => this.onWillBlur()}
				/>
				<ScrollView style={{ maxWidth: getWidth() }}>
					<View style={{ padding: 8, flex: 1, alignItems: "flex-start" }}>
						<View
							style={{
								alignSelf: "stretch",
								display: this.store.randomWordPrefDisplay
							}}
						>
							<CheckBox
								title={Strings.STRING_STARTING_LETTERS}
								checked={this.store.startingLettersChecked}
								containerStyle={{
									alignSelf: "flex-start",
									borderWidth: 0,
									backgroundColor: "white"
								}}
								onPress={() =>
									this.startingLettersPressed(this.store.startingLettersChecked)
								}
							/>
							<Input
								placeholder={Strings.STRING_ENTER_STARTING_LETTERS}
								onChangeText={this.onStartingLettersTextChanged}
								value={this.store.startingLettersText}
								containerStyle={{
									marginBottom: 8,
									display: this.inputDisplay(
										Strings.STRING_STARTING_LETTERS
									)
								}}
							/>
							<Divider />
							<CheckBox
								title={Strings.STRING_ENDING_LETTERS}
								checked={this.store.endingLettersChecked}
								containerStyle={{
									alignSelf: "flex-start",
									borderWidth: 0,
									backgroundColor: "white"
								}}
								onPress={() =>
									this.endingLettersPressed(this.store.endingLettersChecked)
								}
							/>
							<Input
								placeholder={Strings.STRING_ENTER_ENDING_LETTERS}
								onChangeText={this.onEndingLettersTextChanged}
								value={this.store.endingLettersText}
								containerStyle={{
									marginBottom: 8,
									display: this.inputDisplay(Strings.STRING_ENDING_LETTERS)
								}}
							/>
							<Divider />
							<CheckBox
								title={Strings.STRING_CONTAINING_LETTERS}
								checked={this.store.partialLettersChecked}
								containerStyle={{
									alignSelf: "flex-start",
									borderWidth: 0,
									backgroundColor: "white"
								}}
								onPress={() =>
									this.partialLettersPressed(this.store.partialLettersChecked)
								}
							/>
							<Input
								placeholder={Strings.STRING_ENTER_CONTAINING_LETTERS}
								onChangeText={this.onPartialLettersTextChanged}
								value={this.store.partialLettersText}
								containerStyle={{
									marginBottom: 8,
									display: this.inputDisplay(
										Strings.STRING_CONTAINING_LETTERS
									)
								}}
							/>
							<Divider />
							<Text
								style={{
									marginVertical: 8,
									paddingLeft: 8,
									fontWeight: "bold"
								}}
							>
								Part of speech
							</Text>
							<ButtonGroup
								onPress={this.changeIndex}
								buttons={buttons}
								selectedIndex={this.store.selectedPartOfSpeechIndex}
								containerStyle={{ marginBottom: 16 }}
							/>
							<Divider />
							<CheckBox
								title={Strings.STRING_ONLY_PRONUNCIATION}
								checked={this.store.onlyPronunciationWordChecked}
								containerStyle={{
									alignSelf: "flex-start",
									borderWidth: 0,
									backgroundColor: "white"
								}}
								textStyle={{ marginRight: 16 }}
								onPress={() =>
									this.onlyPronunciationWordPressed(
										this.store.onlyPronunciationWordChecked
									)
								}
							/>
							<Divider />
						</View>
						<CheckBox
							title={Strings.STRING_SPECIFIC_WORD}
							checked={this.store.specificWordChecked}
							containerStyle={{
								alignSelf: "flex-start",
								borderWidth: 0,
								backgroundColor: "white"
							}}
							onPress={() =>
								this.specificWordPressed(this.store.specificWordChecked)
							}
						/>
						<Input
							placeholder={Strings.STRING_ENTER_SPECIFIC_WORD}
							onChangeText={this.onSpecificWordTextChanged}
							value={this.store.specificWordText}
							containerStyle={{
								marginBottom: 8,
								display: this.inputDisplay(Strings.STRING_SPECIFIC_WORD)
							}}
						/>
						<Divider style={{ alignSelf: "stretch" }} />
						<Button
							title={Strings.STRING_CLEAR_VOC}
							containerStyle={{ marginTop: 8, alignSelf: "center" }}
							icon={
								<Icon
									name='playlist-remove'
									type='material-community'
									color='red'
									containerStyle={{ marginRight: 2 }}
								/>
							}
							onPress={() => this.clearVocabulary()}
						/>
					</View>
				</ScrollView>
			</View>
		);
	}

	componentDidMount() {
		userId = firebaseAuth.currentUser.uid;
		userWordsDetailsCollection = firebase
			.firestore()
			.collection(
				Strings.STRING_WORDS_DETAILS +
				userId +
				Strings.STRING_USER_WORDS_DETAILS
			);

		Realm.open({})
			.then(realm => {
				realm.write(() => {
					if (
						!realm
							.objects(Strings.STRING_SETTINGS_SCREEN_REALM_PATH)
							.isEmpty()
					) {
						let settingsScreen = realm.objects(
							Strings.STRING_SETTINGS_SCREEN_REALM_PATH
						);
						let settingsPreferencesInRealm = getSettingsPreferencesInRealm(
							settingsScreen
						);
						this.store.updateSettingsPreferences(settingsPreferencesInRealm);
					} else {
						realm.create(Strings.STRING_SETTINGS_SCREEN_REALM_PATH, {
							pk: 0,
							partOfSpeechIndex: 0,
							startingLettersChecked: false,
							endingLettersChecked: false,
							partialLettersChecked: false,
							onlyPronunciationWordChecked: false,
							specificWordChecked: false,
							startingLettersText: "",
							endingLettersText: "",
							partialLettersText: "",
							specificWordText: "",
							apiUrl: AppConstants.RANDOM_URL
						});
					}
				});
			})
			.catch(() =>
				ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT)
			);	
	}

	componentWillUnmount() {
	}

    onDidFocus = () => {
		BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
		this.manageAccountStatus()
    }

    onWillBlur = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
	}
	
    manageAccountStatus = () => {
        blackListCollection.where('id', '==', userId).get()
        .then((querySnapshot) => {
            if(!querySnapshot.empty) {
                signOut()
                querySnapshot.forEach((docSnapshot) => {
                    switch(docSnapshot.data().banType) {
                        case BanTypes.DELETED:
                            ToastAndroid.show(Toasts.TOAST_ACCOUNT_DELETED, ToastAndroid.SHORT)
                            break;

                        case BanTypes.DISABLED:
                            ToastAndroid.show(Toasts.TOAST_ACCOUNT_DISABLED, ToastAndroid.SHORT)
                            break;
                    }
                })
			}
        },
        () => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))
    }

	onBackButtonPressAndroid = () => {
		if(this.store.isSettingsMenuOpen) {
            this.store.setCloseSettingsMenu(true)
            return true
        }
        return false;
	}

	inputDisplay = checkBoxType => {
		switch (checkBoxType) {
			case Strings.STRING_STARTING_LETTERS:
				return this.store.startingLettersChecked ? "flex" : "none";

			case Strings.STRING_ENDING_LETTERS:
				return this.store.endingLettersChecked ? "flex" : "none";

			case Strings.STRING_CONTAINING_LETTERS:
				return this.store.partialLettersChecked ? "flex" : "none";

			case Strings.STRING_SPECIFIC_WORD:
				return this.store.specificWordChecked ? "flex" : "none";

			default:
				return "none";
		}
	};

	clearVocabulary = () => {
		userWordsDetailsCollection.get().then(
			querySnapshot =>
				querySnapshot.forEach(doc =>
					firebase
						.firestore()
						.batch()
						.delete(doc.ref)
						.commit()
				),
			() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT)
		);
		ToastAndroid.show(Toasts.TOAST_VOC_LIST_CLEARED, ToastAndroid.SHORT);
	};

	changeIndex = selectedPartOfSpeechIndex => {
		this.store.updateIndex(selectedPartOfSpeechIndex);
	};

	startingLettersPressed = currentStatus => {
		this.store.updateStartingLettersCheckBox(currentStatus);
	};

	endingLettersPressed = currentStatus => {
		this.store.updateEndingLettersCheckBox(currentStatus);
	};

	specificWordPressed = currentStatus => {
		this.store.updateSpecificWordCheckBox(currentStatus);
	};

	partialLettersPressed = currentStatus => {
		this.store.updatePartialWordCheckbox(currentStatus);
	};

	onlyPronunciationWordPressed = currentStatus => {
		this.store.updatePronunciationCheckbox(currentStatus);
	};

	onStartingLettersTextChanged = changedText => {
		this.store.updateStartingLettersText(changedText);
	};

	onEndingLettersTextChanged = changedText => {
		this.store.updateEndingLettersText(changedText);
	};

	onPartialLettersTextChanged = changedText => {
		this.store.updatePartialLettersText(changedText);
	};

	onSpecificWordTextChanged = changedText => {
		this.store.updateSpecificWordText(changedText);
	};
}

export default inject("store")(observer(Settings));

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "flex-start"
	}
});

Settings.propTypes = {
    navigation: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
}

function getRealmData(realm) {
	return _.valuesIn(realm)[0];
}

function getSettingsPreferencesInRealm(settingsScreenRealmData) {
	let realmData = getRealmData(settingsScreenRealmData);

	let partOfSpeechIndex = realmData.partOfSpeechIndex;
	let startingLettersChecked = realmData.startingLettersChecked;
	let endingLettersChecked = realmData.endingLettersChecked;
	let partialLettersChecked = realmData.partialLettersChecked;
	let onlyPronunciationWordChecked = realmData.onlyPronunciationWordChecked;
	let specificWordChecked = realmData.specificWordChecked;
	let startingLettersText = realmData.startingLettersText;
	let endingLettersText = realmData.endingLettersText;
	let partialLettersText = realmData.partialLettersText;
	let specificWordText = realmData.specificWordText;
	let apiUrl = realmData.apiUrl;

	return {
		startingLettersChecked,
		endingLettersChecked,
		partialLettersChecked,
		onlyPronunciationWordChecked,
		specificWordChecked,
		partOfSpeechIndex,
		startingLettersText,
		endingLettersText,
		partialLettersText,
		specificWordText,
		apiUrl
	};
}

function getWidth() {
	return Dimensions.get("window").width;
}

function signOut() {
    firebaseAuth.signOut()
}
