import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Icon, CheckBox, Input, ButtonGroup, Button } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'

import AppConstants from '../Constants'

const wordsDetailsCollection = firebase.firestore().collection('wordsDetails')
const wordsCollection = firebase.firestore().collection('words')
const vexedRef = firebase.firestore().doc('wordsDetails/IK6CJvbLDkMJ2PPlDLmZ')

export default class Settings extends React.Component {

    state = {
        selectedIndex: 0,
        startingLettersChecked: false,
        endingLettersChecked: false
    }

    static navigationOptions = {
        tabBarLabel: AppConstants.STRING_TAB_SETTINGS,
        tabBarIcon: <Icon name= 'settings' />
    }

    updateIndex = (selectedIndex) => {
        this.setState({selectedIndex})
    }

    partOfSpeechAll = () => <Text>All</Text>
    partOfSpeechVerb = () => <Text>Verb</Text>
    partOfSpeechNoun = () => <Text>Noun</Text>
    partOfSpeechAdjective = () => <Text>Adjective</Text>

    render() {

        const buttons = [{ element: this.partOfSpeechAll }, { element: this.partOfSpeechVerb }, { element: this.partOfSpeechNoun }, { element: this.partOfSpeechAdjective }]
        const { selectedIndex } = this.state

        return(
            <View style={styles.container}>
                <CheckBox
                    title= 'Words starting with'
                    checked= {this.state.startingLettersChecked}
                    onPress= {this.startingLettersPressed}
                />
                <Input
                    placeholder= 'Enter starting letters'
                    containerStyle={{marginBottom: 16}}
                />
                <CheckBox
                    title= 'Words ending with'
                    checked= {this.state.endingLettersChecked}
                    onPress= {this.endingLettersPressed}
                />
                <Input
                    placeholder= 'Enter ending letters'
                    containerStyle={{marginBottom: 16}}
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

    startingLettersPressed = () => {
        this.setState({startingLettersChecked: !this.state.startingLettersChecked})
        console.log(this.state.startingLettersChecked);
        
    }

    endingLettersPressed = () => {
        this.setState({endingLettersChecked: !this.state.endingLettersChecked})
        console.log(this.state.endingLettersChecked);
        
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 8
    },
  });
  
  function clearVocabulary() {
      wordsDetailsCollection.get()
      .then((querySnapshot) => querySnapshot.forEach((doc) => firebase.firestore().batch().delete(doc.ref).commit()), (error) => console.log(error))

      wordsCollection.get()
      .then((querySnapshot) => querySnapshot.forEach((doc) => firebase.firestore().batch().delete(doc.ref).commit()), (error) => console.log(error))
  }