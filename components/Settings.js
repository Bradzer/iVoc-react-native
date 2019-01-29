import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux'
import store from '../reducers'
import { Icon, CheckBox, Input, ButtonGroup, Button } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'

import AppConstants from '../Constants'
import { updateIndex, updateStartingLettersCheckBox, updateEndingLettersCheckBox, updateSpecificWordCheckBox, updateStartingLettersText, updateEndingLettersText, updateSpecificWordText, updateSettingsPreferences } from '../actions'
import reactotron from '../ReactotronConfig';

const userId = firebase.auth().currentUser.uid
const userWordsDetailsCollection = firebase.firestore().collection('wordsDetails/' + userId + '/userWordsDetails')

const Realm = require('realm');

const _ = require('lodash')

class Settings extends React.Component {

    static navigationOptions = {
        tabBarLabel: AppConstants.STRING_TAB_SETTINGS,
        tabBarIcon: <Icon name= 'settings' />
    }

    partOfSpeechAll = () => <Text>All</Text>
    partOfSpeechVerb = () => <Text>Verb</Text>
    partOfSpeechNoun = () => <Text>Noun</Text>
    partOfSpeechAdjective = () => <Text>Adjective</Text>

    navigationListener = this.props.navigation.addListener('didFocus', () => {
    })

    render() {
        const buttons = [{ element: this.partOfSpeechAll }, { element: this.partOfSpeechVerb }, { element: this.partOfSpeechNoun }, { element: this.partOfSpeechAdjective }]
        const { selectedIndex } = this.props

        return(
            <View style={styles.container}>
                <View style={{alignSelf: 'stretch', display: this.props.randomWordPrefDisplay}}>
                    <CheckBox
                        title= 'Words starting with'
                        checked= {this.props.startingLettersChecked}
                        onPress= {() => startingLettersPressed(this.props.startingLettersChecked)}
                    />
                    <Input
                        placeholder= 'Enter starting letters'
                        onChangeText= {onStartingLettersTextChanged}
                        value={this.props.startingLettersText}
                        containerStyle={{marginBottom: 16, display: this.inputDisplay('startingLetters')}}
                    />
                    <CheckBox
                        title= 'Words ending with'
                        checked= {this.props.endingLettersChecked}
                        onPress= {() => endingLettersPressed(this.props.endingLettersChecked)}
                    />
                    <Input
                        placeholder= 'Enter ending letters'
                        onChangeText={onEndingLettersTextChanged}
                        value={this.props.endingLettersText}
                        containerStyle={{marginBottom: 16, display: this.inputDisplay('endingLetters')}}
                    />
                    <Text style={{marginBottom: 8}}>Part of speech</Text>
                    <ButtonGroup
                        onPress={changeIndex}
                        buttons={buttons}
                        selectedIndex={selectedIndex}
                        containerStyle={{marginBottom: 16}}
                    />
                </View>
                <CheckBox
                        title= 'Search for a specific word/expression'
                        checked= {this.props.specificWordChecked}
                        onPress= {() => specificWordPressed(this.props.specificWordChecked)}
                    />
                    <Input
                        placeholder= 'Enter the word/expression'
                        onChangeText= {onSpecificWordTextChanged}
                        value={this.props.specificWordText}
                        containerStyle={{marginBottom: 16, display: this.inputDisplay('specificWord')}}
                    />
                <Button 
                    title='Clear vocabulary'
                    icon={<Icon name='playlist-remove' type='material-community' color='red'/>}
                    onPress={clearVocabulary}/>
            </View>
        )
    }

    componentDidMount() {
        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                if(!(realm.objects('settingsScreen').isEmpty())) {
                    let settingsScreen = realm.objects('settingsScreen')
                    reactotron.logImportant('VALUES UNCHANGED FROM REAL : ', settingsScreen)
                    let settingsPreferencesInRealm = getSettingsPreferencesInRealm(settingsScreen)
                    // reactotron.logImportant('VALUES BEFORE DISPATCH : ', updatedIndex, startingLettersChecked, endingLettersChecked, specificWordChecked, startingLettersText, endingLettersText, specificWordText, apiUrl)
                    store.dispatch(updateSettingsPreferences(settingsPreferencesInRealm))
                }
                else{
                    // reactotron.logImportant('REALM BEFORE CREATION : ', realm.objects('settingsScreen'))
                    realm.create('settingsScreen', { pk: 0 , updatedIndex: 0, startingLettersChecked: false, endingLettersChecked: false, specificWordChecked: false, startingLettersText: '', endingLettersText: '', specificWordText: '', apiUrl: AppConstants.RANDOM_URL})
                    // reactotron.logImportant('REALM AFTER CREATION : ', realm.objects('settingsScreen'))
                }
            })
        })
        .catch((error) => console.log(error))
    }

    inputDisplay = (checkBoxType) => {
        switch(checkBoxType) {
            case 'startingLetters':
                return (this.props.startingLettersChecked ? 'flex' : 'none')
            
            case 'endingLetters':
                return (this.props.endingLettersChecked ? 'flex' : 'none')

            case 'specificWord':
                return (this.props.specificWordChecked ? 'flex' : 'none')

            default:
                return 'none'
        }
    }
}

export default connect(mapStateToProps)(Settings)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 8
    },
  });
  
  function mapStateToProps(state) {
      return {
        selectedIndex: state.selectedIndex,
        startingLettersChecked: state.startingLettersChecked,
        endingLettersChecked: state.endingLettersChecked,
        realm: state.realm,
        startingLettersText: state.startingLettersText,
        endingLettersText: state.endingLettersText,
        specificWordChecked: state.specificWordChecked,
        specificWordText: state.specificWordText,
        randomWordPrefDisplay: state.randomWordPrefDisplay
      }
  }

  function clearVocabulary() {
    userWordsDetailsCollection.get()
      .then((querySnapshot) => querySnapshot.forEach((doc) => firebase.firestore().batch().delete(doc.ref).commit()), (error) => console.log(error))
  }

const changeIndex = (selectedIndex) => {
    store.dispatch(updateIndex(selectedIndex))
}

const startingLettersPressed = (currentStatus) => {
    store.dispatch(updateStartingLettersCheckBox(currentStatus))
}

const endingLettersPressed = (currentStatus) => {
    store.dispatch(updateEndingLettersCheckBox(currentStatus))
}

const specificWordPressed = (currentStatus) => {
    store.dispatch(updateSpecificWordCheckBox(currentStatus))
}

const onStartingLettersTextChanged = (changedText) => {
    store.dispatch(updateStartingLettersText(changedText))
}

const onEndingLettersTextChanged = (changedText) => {
    store.dispatch(updateEndingLettersText(changedText))
}

const onSpecificWordTextChanged = (changedText) => {
    store.dispatch(updateSpecificWordText(changedText))
}

const getSettingsPreferencesInRealm = (settingsScreenRealmData) => {
    let updatedIndex = (_.valuesIn(settingsScreenRealmData))[0].updatedIndex
    let startingLettersChecked = (_.valuesIn(settingsScreenRealmData))[0].startingLettersChecked
    let endingLettersChecked = (_.valuesIn(settingsScreenRealmData))[0].endingLettersChecked
    let specificWordChecked = (_.valuesIn(settingsScreenRealmData))[0].specificWordChecked
    let startingLettersText = (_.valuesIn(settingsScreenRealmData))[0].startingLettersText
    let endingLettersText = (_.valuesIn(settingsScreenRealmData))[0].endingLettersText
    let specificWordText = (_.valuesIn(settingsScreenRealmData))[0].specificWordText
    let apiUrl = (_.valuesIn(settingsScreenRealmData))[0].apiUrl

    return { startingLettersChecked, endingLettersChecked, specificWordChecked, updatedIndex, startingLettersText, endingLettersText, specificWordText, apiUrl }
}