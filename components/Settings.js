import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux'
import store from '../reducers'
import { Icon, CheckBox, Input, ButtonGroup, Button } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import SyncStorage from 'sync-storage';

import AppConstants from '../Constants'
import { updateIndex, updateStartingLettersCheckBox, updateEndingLettersCheckBox, updateRealm } from '../actions'

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
        updatedIndex: 'int?'
    }
}


class Settings extends React.Component {

    static navigationOptions = {
        tabBarLabel: AppConstants.STRING_TAB_SETTINGS,
        tabBarIcon: <Icon name= 'settings' />
    }

    updateIndex = (selectedIndex) => {
        store.dispatch(updateIndex(selectedIndex))
    }

    partOfSpeechAll = () => <Text>All</Text>
    partOfSpeechVerb = () => <Text>Verb</Text>
    partOfSpeechNoun = () => <Text>Noun</Text>
    partOfSpeechAdjective = () => <Text>Adjective</Text>

    selectedIndexLocal = () => {
        if(SyncStorage.get('updateIndex')) {
            store.dispatch(updateIndex(SyncStorage.get('updateIndex')))
        }
    }

    navigationListener = this.props.navigation.addListener('didFocus', () => {
        // Realm.open({})
        // .then((realm) => {
        //     let foo = realm.objects('settingsScreen')
        //     console.log('SETTINGS SCREEN OBJECTS : ', (_.valuesIn(foo))[0].updatedIndex)
        // })
    })

    render() {
        const buttons = [{ element: this.partOfSpeechAll }, { element: this.partOfSpeechVerb }, { element: this.partOfSpeechNoun }, { element: this.partOfSpeechAdjective }]
        const { selectedIndex } = this.props

        return(
            <View style={styles.container}>
                <CheckBox
                    title= 'Words starting with'
                    checked= {this.props.startingLettersChecked}
                    onPress= {this.startingLettersPressed}
                />
                <Input
                    placeholder= 'Enter starting letters'
                    containerStyle={{marginBottom: 16, display: this.inputDisplay('startingLetters')}}
                />
                <CheckBox
                    title= 'Words ending with'
                    checked= {this.props.endingLettersChecked}
                    onPress= {this.endingLettersPressed}
                />
                <Input
                    placeholder= 'Enter ending letters'
                    containerStyle={{marginBottom: 16, display: this.inputDisplay('endingLetters')}}
                />
                <Text style={{marginBottom: 8}}>Part of speech</Text>
                <ButtonGroup
                    onPress={this.updateIndex}
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
                        store.dispatch(updateIndex(updatedIndex))
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

    startingLettersPressed = () => {
        store.dispatch(updateStartingLettersCheckBox())
    }

    endingLettersPressed = () => {
        store.dispatch(updateEndingLettersCheckBox())
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
        realm: state.realm
    
      }
  }
  function clearVocabulary() {
      wordsDetailsCollection.get()
      .then((querySnapshot) => querySnapshot.forEach((doc) => firebase.firestore().batch().delete(doc.ref).commit()), (error) => console.log(error))

      wordsCollection.get()
      .then((querySnapshot) => querySnapshot.forEach((doc) => firebase.firestore().batch().delete(doc.ref).commit()), (error) => console.log(error))
  }