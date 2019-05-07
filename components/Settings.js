/* global require */

import React from 'react';
import { StyleSheet, View, Text, ToastAndroid, ScrollView, Dimensions } from 'react-native';
import { Icon, CheckBox, Input, ButtonGroup, Button, Divider } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { inject, observer } from 'mobx-react'

import {SettingsOverflowMenu} from './OverflowMenu'
import AppConstants from '../Constants'

let firebaseAuth = null
let userId = null
let userWordsDetailsCollection = null

const Realm = require('realm');

const _ = require('lodash')

class Settings extends React.Component {

    store = this.props.store

    static navigationOptions = ({navigation}) => {
        return{
            headerTitle: AppConstants.STRING_SETTINGS,
            tabBarLabel: AppConstants.STRING_TAB_SETTINGS,
            tabBarIcon: <Icon name= 'settings' />,
            headerStyle: {
                backgroundColor: AppConstants.APP_PRIMARY_COLOR
              },
              headerTintColor: AppConstants.COLOR_WHITE,
              headerRight: <SettingsOverflowMenu navigation={navigation} />    
        }      
    }

    partOfSpeechAll = () => <Text style={{fontWeight: 'bold', fontStyle: this.store.selectedIndex === AppConstants.PART_OF_SPEECH_ALL_INDEX ? 'italic' : 'normal'}}>{AppConstants.STRING_ALL}</Text>
    partOfSpeechVerb = () => <Text style={{fontWeight: 'bold', fontStyle: this.store.selectedIndex === AppConstants.PART_OF_SPEECH_VERB_INDEX ? 'italic' : 'normal'}}>{AppConstants.STRING_VERB}</Text>
    partOfSpeechNoun = () => <Text style={{fontWeight: 'bold', fontStyle: this.store.selectedIndex === AppConstants.PART_OF_SPEECH_NOUN_INDEX ? 'italic' : 'normal'}}>{AppConstants.STRING_NOUN}</Text>
    partOfSpeechAdjective = () => <Text style={{fontWeight: 'bold', fontStyle: this.store.selectedIndex === AppConstants.PART_OF_SPEECH_ADJECTIVE_INDEX ? 'italic' : 'normal'}}>{AppConstants.STRING_ADJECTIVE}</Text>
    partOfSpeechAdverb = () => <Text style={{fontWeight: 'bold', fontStyle: this.store.selectedIndex === AppConstants.PART_OF_SPEECH_ADVERB_INDEX ? 'italic' : 'normal'}}>{AppConstants.STRING_ADVERB}</Text>

    navigationListener = this.props.navigation.addListener('didFocus', () => {
    })

    render() {
        const buttons = [{ element: this.partOfSpeechAll }, { element: this.partOfSpeechVerb }, { element: this.partOfSpeechNoun }, { element: this.partOfSpeechAdjective }, { element: this.partOfSpeechAdverb }]

        return(
            <View style={styles.container}>
            <ScrollView style={{maxWidth: getWidth()}}>
                <View style={{ padding: 8, flex: 1, alignItems: 'flex-start'}}>
                    <View style={{alignSelf: 'stretch', display: this.store.randomWordPrefDisplay}}>
                        <CheckBox
                            title= {AppConstants.STRING_STARTING_LETTERS}
                            checked= {this.store.startingLettersChecked}
                            containerStyle={{alignSelf: 'flex-start', borderWidth: 0, backgroundColor: 'white'}}
                            onPress= {() => this.startingLettersPressed(this.store.startingLettersChecked)}
                        />
                        <Input
                            placeholder= {AppConstants.STRING_ENTER_STARTING_LETTERS}
                            onChangeText= {this.onStartingLettersTextChanged}
                            value={this.store.startingLettersText}
                            containerStyle={{marginBottom: 8, display: this.inputDisplay(AppConstants.STRING_STARTING_LETTERS)}}
                        />
                        <Divider />
                        <CheckBox
                            title= {AppConstants.STRING_ENDING_LETTERS}
                            checked= {this.store.endingLettersChecked}
                            containerStyle={{alignSelf: 'flex-start', borderWidth: 0, backgroundColor: 'white'}}
                            onPress= {() => this.endingLettersPressed(this.store.endingLettersChecked)}
                        />
                        <Input
                            placeholder= {AppConstants.STRING_ENTER_ENDING_LETTERS}
                            onChangeText={this.onEndingLettersTextChanged}
                            value={this.store.endingLettersText}
                            containerStyle={{marginBottom: 8, display: this.inputDisplay(AppConstants.STRING_ENDING_LETTERS)}}
                        />
                        <Divider />
                        <CheckBox 
                        title= {AppConstants.STRING_CONTAINING_LETTERS}
                        checked= {this.store.partialLettersChecked}
                        containerStyle={{alignSelf: 'flex-start', borderWidth: 0, backgroundColor: 'white'}}
                        onPress= {() => this.partialLettersPressed(this.store.partialLettersChecked)}
                        />
                        <Input
                        placeholder= {AppConstants.STRING_ENTER_CONTAINING_LETTERS} 
                        onChangeText= {this.onPartialLettersTextChanged}
                        value= {this.store.partialLettersText}
                        containerStyle={{marginBottom: 8, display: this.inputDisplay(AppConstants.STRING_CONTAINING_LETTERS)}}
                        />
                        <Divider />
                        <Text style={{marginVertical: 8, paddingLeft: 8, fontWeight: 'bold',}}>Part of speech</Text>
                        <ButtonGroup
                            onPress={this.changeIndex}
                            buttons={buttons}
                            selectedIndex={this.store.selectedIndex}
                            containerStyle={{marginBottom: 16}}
                        />
                        <Divider />
                        <CheckBox
                            title= {AppConstants.STRING_ONLY_PRONUNCIATION}
                            checked= {this.store.onlyPronunciationWordChecked}
                            containerStyle={{alignSelf: 'flex-start', borderWidth: 0, backgroundColor: 'white'}}
                            textStyle={{marginRight: 16}}
                            onPress= {() => this.onlyPronunciationWordPressed(this.store.onlyPronunciationWordChecked)}
                        />
                        <Divider />
                    </View>
                    <CheckBox
                            title= {AppConstants.STRING_SPECIFIC_WORD}
                            checked= {this.store.specificWordChecked}
                            containerStyle={{alignSelf: 'flex-start', borderWidth: 0, backgroundColor: 'white'}}
                            onPress= {() => this.specificWordPressed(this.store.specificWordChecked)}
                    />
                    <Input
                        placeholder= {AppConstants.STRING_ENTER_SPECIFIC_WORD}
                        onChangeText= {this.onSpecificWordTextChanged}
                        value={this.store.specificWordText}
                        containerStyle={{marginBottom: 8, display: this.inputDisplay(AppConstants.STRING_SPECIFIC_WORD)}}
                    />
                    <Divider style={{alignSelf: 'stretch'}}/>
                    <Button 
                        title={AppConstants.STRING_CLEAR_VOC}
                        containerStyle={{marginTop: 8, alignSelf: 'center'}}
                        icon={<Icon name='playlist-remove' type='material-community' color='red' containerStyle={{marginRight: 2}}/>}
                        onPress={() => this.clearVocabulary()}/>
                </View>
            </ScrollView>
            </View>
        )
    }

    componentDidMount() {
        
        firebaseAuth = firebase.auth()
        userId = firebaseAuth.currentUser.uid
        userWordsDetailsCollection = firebase.firestore().collection(AppConstants.STRING_WORDS_DETAILS + userId + AppConstants.STRING_USER_WORDS_DETAILS)

        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                if(!(realm.objects(AppConstants.STRING_SETTINGS_SCREEN_REALM_PATH).isEmpty())) {
                    let settingsScreen = realm.objects(AppConstants.STRING_SETTINGS_SCREEN_REALM_PATH)
                    let settingsPreferencesInRealm = getSettingsPreferencesInRealm(settingsScreen)
                    this.store.updateSettingsPreferences(settingsPreferencesInRealm)
                }
                else{
                    realm.create(AppConstants.STRING_SETTINGS_SCREEN_REALM_PATH, { pk: 0 , updatedIndex: 0, startingLettersChecked: false, endingLettersChecked: false, partialLettersChecked: false, onlyPronunciationWordChecked: false, specificWordChecked: false, startingLettersText: '', endingLettersText: '', partialLettersText: '', specificWordText: '', apiUrl: AppConstants.RANDOM_URL})
                }
            })
        })
        .catch((error) => ToastAndroid.show(AppConstants.TOAST_ERROR, ToastAndroid.SHORT))
    }

    inputDisplay = (checkBoxType) => {
        switch(checkBoxType) {
            case AppConstants.STRING_STARTING_LETTERS:
                return (this.store.startingLettersChecked ? 'flex' : 'none')
            
            case AppConstants.STRING_ENDING_LETTERS:
                return (this.store.endingLettersChecked ? 'flex' : 'none')

            case AppConstants.STRING_CONTAINING_LETTERS:
                return (this.store.partialLettersChecked ? 'flex' : 'none')

            case AppConstants.STRING_SPECIFIC_WORD:
                return (this.store.specificWordChecked ? 'flex' : 'none')

            default:
                return 'none'
        }
    }

    clearVocabulary = () => {
        userWordsDetailsCollection.get()
          .then((querySnapshot) => querySnapshot.forEach((doc) => firebase.firestore().batch().delete(doc.ref).commit()), (error) => ToastAndroid.show(AppConstants.TOAST_ERROR, ToastAndroid.SHORT))
          ToastAndroid.show(AppConstants.TOAST_VOC_LIST_CLEARED, ToastAndroid.SHORT)
    }
    
    changeIndex = (selectedIndex) => {
        this.store.updateIndex(selectedIndex)
    }
    
    startingLettersPressed = (currentStatus) => {
        this.store.updateStartingLettersCheckBox(currentStatus)
    }
    
    endingLettersPressed = (currentStatus) => {
        this.store.updateEndingLettersCheckBox(currentStatus)
    }
    
    specificWordPressed = (currentStatus) => {
        this.store.updateSpecificWordCheckBox(currentStatus)
    }
    
    partialLettersPressed = (currentStatus) => {
        this.store.updatePartialWordCheckbox(currentStatus)
    }
    
    onlyPronunciationWordPressed = (currentStatus) => {
        this.store.updatePronunciationCheckbox(currentStatus)
    }
    
    onStartingLettersTextChanged = (changedText) => {
        this.store.updateStartingLettersText(changedText)
    }
    
    onEndingLettersTextChanged = (changedText) => {
        this.store.updateEndingLettersText(changedText)
    }
    
    onPartialLettersTextChanged = (changedText) => {
        this.store.updatePartialLettersText(changedText)
    }
    
    onSpecificWordTextChanged = (changedText) => {
        this.store.updateSpecificWordText(changedText)
    }
}

export default inject('store')(observer(Settings))

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  });

  function getSettingsPreferencesInRealm(settingsScreenRealmData) {
    let updatedIndex = (_.valuesIn(settingsScreenRealmData))[0].updatedIndex
    let startingLettersChecked = (_.valuesIn(settingsScreenRealmData))[0].startingLettersChecked
    let endingLettersChecked = (_.valuesIn(settingsScreenRealmData))[0].endingLettersChecked
    let partialLettersChecked = (_.valuesIn(settingsScreenRealmData))[0].partialLettersChecked
    let onlyPronunciationWordChecked = (_.valuesIn(settingsScreenRealmData))[0].onlyPronunciationWordChecked
    let specificWordChecked = (_.valuesIn(settingsScreenRealmData))[0].specificWordChecked
    let startingLettersText = (_.valuesIn(settingsScreenRealmData))[0].startingLettersText
    let endingLettersText = (_.valuesIn(settingsScreenRealmData))[0].endingLettersText
    let partialLettersText = (_.valuesIn(settingsScreenRealmData))[0].partialLettersText
    let specificWordText = (_.valuesIn(settingsScreenRealmData))[0].specificWordText
    let apiUrl = (_.valuesIn(settingsScreenRealmData))[0].apiUrl

    return { startingLettersChecked, endingLettersChecked, partialLettersChecked, onlyPronunciationWordChecked, specificWordChecked, updatedIndex, startingLettersText, endingLettersText, partialLettersText, specificWordText, apiUrl }
}

function getWidth() {
    return Dimensions.get('window').width
}
