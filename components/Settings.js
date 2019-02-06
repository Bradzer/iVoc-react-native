import React from 'react';
import { StyleSheet, View, Text, ToastAndroid, ScrollView } from 'react-native';
import { Icon, CheckBox, Input, ButtonGroup, Button } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { inject, observer } from 'mobx-react'
import { autorun } from 'mobx'

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
            headerTitle: 'Settings',
            tabBarLabel: AppConstants.STRING_TAB_SETTINGS,
            tabBarIcon: <Icon name= 'settings' />,
            headerStyle: {
                backgroundColor: AppConstants.APP_PRIMARY_COLOR
              },
              headerTintColor: AppConstants.COLOR_WHITE,
              headerRight: <SettingsOverflowMenu navigation={navigation} />    
        }      
    }

    partOfSpeechAll = () => <Text>All</Text>
    partOfSpeechVerb = () => <Text>Verb</Text>
    partOfSpeechNoun = () => <Text>Noun</Text>
    partOfSpeechAdjective = () => <Text>Adjective</Text>

    navigationListener = this.props.navigation.addListener('didFocus', () => {
    })

    render() {
        const buttons = [{ element: this.partOfSpeechAll }, { element: this.partOfSpeechVerb }, { element: this.partOfSpeechNoun }, { element: this.partOfSpeechAdjective }]

        return(
            <View style={styles.container}>
            <ScrollView>
                <View>
                    <View style={{alignSelf: 'stretch', display: this.store.randomWordPrefDisplay}}>
                        <CheckBox
                            title= 'Words starting with'
                            checked= {this.store.startingLettersChecked}
                            onPress= {() => this.startingLettersPressed(this.store.startingLettersChecked)}
                        />
                        <Input
                            placeholder= 'Enter starting letters'
                            onChangeText= {() => this.onStartingLettersTextChanged()}
                            value={this.store.startingLettersText}
                            containerStyle={{marginBottom: 16, display: this.inputDisplay('startingLetters')}}
                        />
                        <CheckBox
                            title= 'Words ending with'
                            checked= {this.store.endingLettersChecked}
                            onPress= {() => this.endingLettersPressed(this.store.endingLettersChecked)}
                        />
                        <Input
                            placeholder= 'Enter ending letters'
                            onChangeText={() => this.onEndingLettersTextChanged()}
                            value={this.store.endingLettersText}
                            containerStyle={{marginBottom: 16, display: this.inputDisplay('endingLetters')}}
                        />
                        <CheckBox 
                        title= 'Words containing part with'
                        checked= {this.store.partialLettersChecked}
                        onPress= {() => this.partialLettersPressed(this.store.partialLettersChecked)}
                        />
                        <Input
                        placeholder= 'Enter part of the word/expression' 
                        onChangeText= {() => this.onPartialLettersTextChanged()}
                        value= {this.store.partialLettersText}
                        containerStyle={{marginBottom: 16, display: this.inputDisplay('partialLetters')}}
                        />
                        <Text style={{marginBottom: 8}}>Part of speech</Text>
                        <ButtonGroup
                            onPress={this.changeIndex}
                            buttons={buttons}
                            selectedIndex={this.store.selectedIndex}
                            containerStyle={{marginBottom: 16}}
                        />
                        <CheckBox
                            title= 'Only word/expression with pronunciation'
                            checked= {this.store.onlyPronunciationWordChecked}
                            onPress= {() => this.onlyPronunciationWordPressed(this.store.onlyPronunciationWordChecked)}
                        />
                    </View>
                    <CheckBox
                            title= 'Search for a specific word/expression'
                            checked= {this.store.specificWordChecked}
                            onPress= {() => this.specificWordPressed(this.store.specificWordChecked)}
                    />
                    <Input
                        placeholder= 'Enter the word/expression'
                        onChangeText= {() => this.onSpecificWordTextChanged()}
                        value={this.store.specificWordText}
                        containerStyle={{marginBottom: 16, display: this.inputDisplay('specificWord')}}
                    />
                    <Button 
                        title='Clear vocabulary'
                        icon={<Icon name='playlist-remove' type='material-community' color='red'/>}
                        onPress={() => this.clearVocabulary()}/>
                </View>
            </ScrollView>
            </View>
        )
    }

    componentDidMount() {
        
        firebaseAuth = firebase.auth()
        userId = firebaseAuth.currentUser.uid
        userWordsDetailsCollection = firebase.firestore().collection('wordsDetails/' + userId + '/userWordsDetails')

        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                if(!(realm.objects('settingsScreen').isEmpty())) {
                    let settingsScreen = realm.objects('settingsScreen')
                    let settingsPreferencesInRealm = getSettingsPreferencesInRealm(settingsScreen)
                    this.store.updateSettingsPreferences(settingsPreferencesInRealm)
                }
                else{
                    realm.create('settingsScreen', { pk: 0 , updatedIndex: 0, startingLettersChecked: false, endingLettersChecked: false, partialLettersChecked: false, onlyPronunciationWordChecked: false, specificWordChecked: false, startingLettersText: '', endingLettersText: '', partialLettersText: '', specificWordText: '', apiUrl: AppConstants.RANDOM_URL})
                }
            })
        })
        .catch((error) => console.log(error))
    }

    inputDisplay = (checkBoxType) => {
        switch(checkBoxType) {
            case 'startingLetters':
                return (this.store.startingLettersChecked ? 'flex' : 'none')
            
            case 'endingLetters':
                return (this.store.endingLettersChecked ? 'flex' : 'none')

            case 'partialLetters':
                return (this.store.partialLettersChecked ? 'flex' : 'none')

            case 'specificWord':
                return (this.store.specificWordChecked ? 'flex' : 'none')

            default:
                return 'none'
        }
    }

    clearVocabulary = () => {
        userWordsDetailsCollection.get()
          .then((querySnapshot) => querySnapshot.forEach((doc) => firebase.firestore().batch().delete(doc.ref).commit()), (error) => console.log(error))
          ToastAndroid.show('vocabulary list cleared', ToastAndroid.SHORT)
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
      padding: 8
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
