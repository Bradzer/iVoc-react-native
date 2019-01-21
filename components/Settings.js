import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux'
import store from '../reducers'
import { Icon, CheckBox, Input, ButtonGroup, Button } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'

import AppConstants from '../Constants'
import { updateIndex, updateStartingLettersCheckBox, updateEndingLettersCheckBox, updateStartingLettersText, updateEndingLettersText, updateSettingsPreferences } from '../actions'

const wordsDetailsCollection = firebase.firestore().collection('wordsDetails')
const wordsCollection = firebase.firestore().collection('words')

const Realm = require('realm');

const _ = require('lodash')

const settingsScreenSchema = {
    name: 'settingsScreen',
    primaryKey: 'pk',
    properties: {
        pk: 'int',
        startingLettersChecked: 'bool?',
        endingLettersChecked: 'bool?',
        updatedIndex: 'int?',
        startingLettersText: 'string?',
        endingLettersText: 'string?'
    }
}


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
                <Button 
                    title='Clear vocabulary'
                    icon={<Icon name='playlist-remove' type='material-community' color='red'/>}
                    onPress={clearVocabulary}/>
            </View>
        )
    }

    UNSAFE_componentWillMount() {

        const realm = new Realm()

        realm.close() 

        Realm.open({schema: [settingsScreenSchema]})
        .then((realm) => {
            realm.write(() => {
                if(realm.objects('settingsScreen').isValid()) {
                    if(!(realm.objects('settingsScreen').isEmpty())) {
                        let settingsScreen = realm.objects('settingsScreen')
                        let updatedIndex = (_.valuesIn(settingsScreen))[0].updatedIndex
                        let startingLettersChecked = (_.valuesIn(settingsScreen))[0].startingLettersChecked
                        let endingLettersChecked = (_.valuesIn(settingsScreen))[0].endingLettersChecked
                        let startingLettersText = (_.valuesIn(settingsScreen))[0].startingLettersText
                        let endingLettersText = (_.valuesIn(settingsScreen))[0].endingLettersText
                        store.dispatch(updateSettingsPreferences(startingLettersChecked, endingLettersChecked, updatedIndex, startingLettersText, endingLettersText))
                    }
                    else{
                        realm.create('settingsScreen', { pk: 0 })
                    }
                }
                else {
                    realm.create('settingsScreen', { pk: 0 })
                }     
            })
        })
        .catch((error) => console.log(error))
    }

    componentDidMount() {

    }

    inputDisplay = (checkBoxType) => {
        switch(checkBoxType) {
            case 'startingLetters':
                return (this.props.startingLettersChecked ? 'flex' : 'none')
            
            case 'endingLetters':
                return (this.props.endingLettersChecked ? 'flex' : 'none')

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
        endingLettersText: state.endingLettersText
      }
  }

  function clearVocabulary() {
      wordsDetailsCollection.get()
      .then((querySnapshot) => querySnapshot.forEach((doc) => firebase.firestore().batch().delete(doc.ref).commit()), (error) => console.log(error))

      wordsCollection.get()
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

const onStartingLettersTextChanged = (changedText) => {
    store.dispatch(updateStartingLettersText(changedText))
}

const onEndingLettersTextChanged = (changedText) => {
    store.dispatch(updateEndingLettersText(changedText))
}