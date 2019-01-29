import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import store from '../reducers'
import firebase, { } from 'react-native-firebase'

import AppConstants from '../Constants'
import { addResponseData, resetResponseData, displayWordDefinition, updateApiUrl, displayUpdateChangePrefsBtn } from '../actions'
import reactotron from '../ReactotronConfig';

let firebaseAuth = null
let userId = null
let userWordsDetailsCollection = null

const axios = require('axios');

let apiRequest = null

const Realm = require('realm');

const _ = require('lodash')

let dataGoingToStore = {}

let apiResponse = {};
let numberOfDefinitions = 0;

class RandomPractice extends React.Component {

    url = ''

    displayFrequency = 'none';

    goToPreferences = () => this.props.navigation.navigate('Settings')

    screenDidFocusListener = this.props.navigation.addListener('didFocus', () => {
        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                let settingsScreen = realm.objects('settingsScreen')
                let apiUrl = (_.valuesIn(settingsScreen))[0].apiUrl
                if(apiUrl && apiUrl !== '') {
                    if(this.props.apiUrl !== apiUrl) {
                        store.dispatch(updateApiUrl(apiUrl))
                        updateApiRequest(this.props.apiUrl)
                    }
                }
                if(this.props.displayChangePrefsBtn === 'flex'){
                    goToNextRandomWord()
                }
                })
            })
        .catch((error) => console.log(error))
        })

    render() {

        return(
            <View style={styles.container}>
            <ScrollView style={{marginBottom: 8, flexGrow: 1, flex: 1, display: this.props.displayScrollView}}>
                <View style={{display: this.props.displayRandomWord}}>
                    <Text>{this.props.itemWord}</Text>
                    <Text>{this.props.itemPartOfSpeech}</Text>
                    <Text>Pronunciation : {this.props.itemPronunciation}</Text>
                    <Text>Frequency of : {this.props.itemFrequency}</Text>
                    <Text></Text>
                    <View style={{display: this.props.displayWordDefinition}}>
                        <Text>Definitions</Text>
                        <Text></Text>
                        <Text>{this.props.itemDef}</Text>
                    </View>

                </View>
            </ScrollView>
                <View style={[styles.buttonGroup, {display: this.props.displayButtons}]}>
                    <Button
                    icon={{name: this.props.buttonLeftIconName, type: this.props.buttonLeftIconType}}
                    title= {this.props.buttonLeftTitle}
                    containerStyle={{marginHorizontal: 16}}
                    onPress={((this.props.buttonLeftTitle !== 'Show definitions') ? addToVocabularyBtnClicked : showWordDefinition)}
                    />
                    <Button
                    icon={{name: this.props.buttonRightIconName, type: this.props.buttonRightIconType}}
                    title= {this.props.buttonRightTitle}
                    containerStyle={{marginHorizontal: 16}}
                    onPress={nextBtnClicked}
                    onLongPress={addToVocabularyBtnClicked}
                    />
                </View>
                <View style={[styles.buttonGroup, {display: this.props.displayChangePrefsBtn}]}>
                <Button
                    title= 'CHANGE RANDOM PRACTICE PREFERENCES'
                    onPress={this.goToPreferences}
                    />
                </View>
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
                    let apiUrl = (_.valuesIn(settingsScreen))[0].apiUrl
                        store.dispatch(updateApiUrl(apiUrl))
                        updateApiRequest(this.props.apiUrl)
                }
                else{
                    realm.create('settingsScreen', { pk: 0 , updatedIndex: 0, startingLettersChecked: false, endingLettersChecked: false, specificWordChecked: false, startingLettersText: '', endingLettersText: '', specificWordText: '', apiUrl: AppConstants.RANDOM_URL})
                    store.dispatch(updateApiUrl(AppConstants.RANDOM_URL))
                    updateApiRequest(this.props.apiUrl)
                }
            })
            goToNextRandomWord();
        })
        .catch((error) => console.log(error))
    }

    componentWillUnmount() {
        store.dispatch(resetResponseData())
    }
}

export default connect(mapStateToProps)(RandomPractice)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 8
    },
    buttonGroup: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    }
})

function mapStateToProps(state) {
    return {
        itemDef: state.itemDef,
        itemSynonyms: state.itemSynonyms,
        itemExamples: state.itemExamples,
        itemWord: state.itemWord,
        itemPartOfSpeech: state.itemPartOfSpeech,
        itemPronunciation: state.itemPronunciation,
        itemFrequency: state.itemFrequency,
        displayRandomWord: state.displayRandomWord,
        displayButtons: state.displayButtons,
        displayWordDefinition: state.displayWordDefinition,
        buttonRightIconName: state.buttonRightIconName,
        buttonRightIconType: state.buttonRightIconType,
        buttonRightTitle: state.buttonRightTitle,
        buttonLeftIconName: state.buttonLeftIconName,
        buttonLeftIconType: state.buttonLeftIconType,
        buttonLeftTitle: state.buttonLeftTitle,
        apiUrl: state.apiUrl,
        displayScrollView: state.displayScrollView,
        displayChangePrefsBtn: state.displayChangePrefsBtn

    }
}

function goToNextRandomWord(){
    let definitions = ''
    apiRequest.get()
    .then((response) => {

        apiResponse = response.data        
        numberOfDefinitions = apiResponse.results.length
        dataGoingToStore = {}
        if(apiResponse.results[0]){
            if(apiResponse.results.length > 1) {
                definitions = getAllDefinitions(apiResponse, numberOfDefinitions)
                dataGoingToStore = createDataGoingToStore(apiResponse, definitions)
            }
            else {
                dataGoingToStore = createDataGoingToStore(apiResponse)
            }
            store.dispatch(addResponseData(dataGoingToStore)) 
        
        }
        else {
            store.dispatch(displayUpdateChangePrefsBtn())
        }
    }, () => {
        store.dispatch(displayUpdateChangePrefsBtn())
    })
    .catch((error) => console.error(error))
}

function nextBtnClicked() {
    goToNextRandomWord()
}

function addToVocabularyBtnClicked() {
    addKnownWordToCloud(dataGoingToStore)
    goToNextRandomWord()
}

function addKnownWordToCloud(word){
    userWordsDetailsCollection.add(word)
    .then((docRef) => {
        docRef.update({id: docRef.id, numberOfRemembrances: 1, numberOfAppearances: 1})
    })
}

function showWordDefinition() {
    store.dispatch(displayWordDefinition())
}

function updateApiRequest(baseURL) {
    apiRequest = axios.create({
        baseURL: baseURL,
        headers: {
            'X-Mashape-Key': AppConstants.WORDS_API_KEY,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

function createDataGoingToStore(apiResponse, definitions= null) {
    if(definitions) {
        return {
            word: apiResponse.word,
            partOfSpeech: (apiResponse.results[0].partOfSpeech ? apiResponse.results[0].partOfSpeech : 'empty'),
            pronunciation: (apiResponse.pronunciation ? (apiResponse.pronunciation.all ? apiResponse.pronunciation.all : 'empty') : 'empty'),
            frequency: (apiResponse.frequency ? apiResponse.frequency.toString() : 'empty'),
            definition: definitions,    
        }
    }
    return {
        word: apiResponse.word,
        partOfSpeech: (apiResponse.results[0].partOfSpeech ? apiResponse.results[0].partOfSpeech : 'empty'),
        pronunciation: (apiResponse.pronunciation ? (apiResponse.pronunciation.all ? apiResponse.pronunciation.all : 'empty') : 'empty'),
        frequency: (apiResponse.frequency ? apiResponse.frequency.toString() : 'empty'),
        definition: apiResponse.results[0].definition,
    }
}

function getAllDefinitions(apiResponse, numberOfDefinitions) {
    let definitions = ''
    for(let i= 0; i < numberOfDefinitions; i++) {
        let partOfSpeech = (apiResponse.results[i].partOfSpeech ? apiResponse.results[i].partOfSpeech : 'empty')
        let definition = apiResponse.results[i].definition
        definitions += i+1 + '.\n' + partOfSpeech + '\n' + definition + '\n\n'
    }
    return definitions
}