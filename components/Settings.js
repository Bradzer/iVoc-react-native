import React from 'react';
import { StyleSheet, View, Text, ToastAndroid, ScrollView } from 'react-native';
import { Icon, CheckBox, Input, ButtonGroup, Button, Divider } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { inject, observer } from 'mobx-react'

import {SettingsOverflowMenu} from './OverflowMenu'
import AppConstants from '../Constants'
import reactotron from '../ReactotronConfig';

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

    partOfSpeechAll = () => <Text style={{fontWeight: 'bold', fontStyle: this.store.selectedIndex === 0 ? 'italic' : 'normal'}}>All</Text>
    partOfSpeechVerb = () => <Text style={{fontWeight: 'bold', fontStyle: this.store.selectedIndex === 1 ? 'italic' : 'normal'}}>Verb</Text>
    partOfSpeechNoun = () => <Text style={{fontWeight: 'bold', fontStyle: this.store.selectedIndex === 2 ? 'italic' : 'normal'}}>Noun</Text>
    partOfSpeechAdjective = () => <Text style={{fontWeight: 'bold', fontStyle: this.store.selectedIndex === 3 ? 'italic' : 'normal'}}>Adjective</Text>

    navigationListener = this.props.navigation.addListener('didFocus', () => {
    })

    render() {
        const buttons = [{ element: this.partOfSpeechAll }, { element: this.partOfSpeechVerb }, { element: this.partOfSpeechNoun }, { element: this.partOfSpeechAdjective }]

        return(
            <View style={styles.container}>
            <ScrollView>
                <View style={{ padding: 8, flex: 1, alignItems: 'flex-start'}}>
                    <View style={{alignSelf: 'stretch', display: this.store.randomWordPrefDisplay}}>
                        <CheckBox
                            title= 'Starting letters'
                            checked= {this.store.startingLettersChecked}
                            containerStyle={{alignSelf: 'flex-start', borderWidth: 0, backgroundColor: 'white'}}
                            onPress= {() => this.startingLettersPressed(this.store.startingLettersChecked)}
                        />
                        <Input
                            placeholder= 'Enter starting letters'
                            onChangeText= {this.onStartingLettersTextChanged}
                            value={this.store.startingLettersText}
                            containerStyle={{marginBottom: 8, display: this.inputDisplay('startingLetters')}}
                        />
                        <Divider />
                        <CheckBox
                            title= 'Ending letters'
                            checked= {this.store.endingLettersChecked}
                            containerStyle={{alignSelf: 'flex-start', borderWidth: 0, backgroundColor: 'white'}}
                            onPress= {() => this.endingLettersPressed(this.store.endingLettersChecked)}
                        />
                        <Input
                            placeholder= 'Enter ending letters'
                            onChangeText={this.onEndingLettersTextChanged}
                            value={this.store.endingLettersText}
                            containerStyle={{marginBottom: 8, display: this.inputDisplay('endingLetters')}}
                        />
                        <Divider />
                        <CheckBox 
                        title= 'Containing letters'
                        checked= {this.store.partialLettersChecked}
                        containerStyle={{alignSelf: 'flex-start', borderWidth: 0, backgroundColor: 'white'}}
                        onPress= {() => this.partialLettersPressed(this.store.partialLettersChecked)}
                        />
                        <Input
                        placeholder= 'Enter part of the word/expression' 
                        onChangeText= {this.onPartialLettersTextChanged}
                        value= {this.store.partialLettersText}
                        containerStyle={{marginBottom: 8, display: this.inputDisplay('partialLetters')}}
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
                            title= 'Only word/expression with pronunciation'
                            checked= {this.store.onlyPronunciationWordChecked}
                            containerStyle={{alignSelf: 'flex-start', borderWidth: 0, backgroundColor: 'white'}}
                            onPress= {() => this.onlyPronunciationWordPressed(this.store.onlyPronunciationWordChecked)}
                        />
                        <Divider />
                    </View>
                    <CheckBox
                            title= 'Search for a specific word/expression'
                            checked= {this.store.specificWordChecked}
                            containerStyle={{alignSelf: 'flex-start', borderWidth: 0, backgroundColor: 'white'}}
                            onPress= {() => this.specificWordPressed(this.store.specificWordChecked)}
                    />
                    <Input
                        placeholder= 'Enter the word/expression'
                        onChangeText= {this.onSpecificWordTextChanged}
                        value={this.store.specificWordText}
                        containerStyle={{marginBottom: 8, display: this.inputDisplay('specificWord')}}
                    />
                    <Divider style={{alignSelf: 'stretch'}}/>
                    <Button 
                        title='Clear vocabulary'
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
