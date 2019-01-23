import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { Button } from 'react-native-elements'
import { connect } from 'react-redux'
import store from '../reducers'
import firebase, { } from 'react-native-firebase'

import AppConstants from '../Constants'
import { addResponseData, resetResponseData, displayWordDefinition, updateApiUrl } from '../actions'
  
const wordsDetailsCollection = firebase.firestore().collection('wordsDetails')
const wordsCollection = firebase.firestore().collection('words')

const axios = require('axios');


// const apiRequest = axios.create({
//     baseURL: getBaseUrl,
//     headers: {
//         'X-Mashape-Key': AppConstants.WORDS_API_KEY,
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     }
// })

let apiRequest = null

const Realm = require('realm');

const settingsScreenSchema = {
    name: 'settingsScreen',
    primaryKey: 'pk',
    properties: {
        pk: 'int',
        startingLettersChecked: 'bool?',
        endingLettersChecked: 'bool?',
        updatedIndex: 'int?',
        startingLettersText: 'string?',
        endingLettersText: 'string?',
        apiUrl: 'string?'
    }
}

const _ = require('lodash')

let dataGoingToStore = {}

let apiResponse = {};
let numberOfDefinitions = 0;

let displayFrequency = 'none';

class RandomPractice extends React.Component {

    url = ''

    displayFrequency = 'none';

    screenDidFocusListener = this.props.navigation.addListener('didFocus', () => {
        Realm.open({schema: [settingsScreenSchema]})
        .then((realm) => {
            realm.write(() => {
                let settingsScreen = realm.objects('settingsScreen')
                let apiUrl = (_.valuesIn(settingsScreen))[0].apiUrl
                if(apiUrl && apiUrl !== '') {
                    if(this.props.apiUrl !== apiUrl) {
                        store.dispatch(updateApiUrl(apiUrl))
                        apiRequest = axios.create({
                            baseURL: this.props.apiUrl,
                            headers: {
                                'X-Mashape-Key': AppConstants.WORDS_API_KEY,
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        })
                    }
                }
                })
            })
        .catch((error) => console.log(error))
        })

    render() {

        return(
            <View style={styles.container}>
            <ScrollView style={{marginBottom: 8, flexGrow: 1, flex: 1}}>
                <View style={{display: this.props.displayWordDefinition}}>
                    <Text>Definition</Text>
                    <Text>{this.props.itemDef}</Text>
                    {/* <Text>Synonyms</Text>
                    <Text>{this.props.itemSynonyms}</Text> */}
                    {/* <Text>Example</Text>
                    <Text>{this.props.itemExamples}</Text> */}
                </View>
                <View style={{display: this.props.displayRandomWord}}>
                    <Text>{this.props.itemWord}</Text>
                    <Text>{this.props.itemPartOfSpeech}</Text>
                    <Text>Pronunciation : {this.props.itemPronunciation}</Text>
                    <Text>Frequency of : {this.props.itemFrequency}</Text>
                </View>
                {/* <Text>{AppConstants.STRING_LOREM_IPSUM}</Text> */}
            </ScrollView>
                <View style={[styles.buttonGroup, {display: this.props.displayButtons}]}>
                    <Button
                    icon={{name: this.props.buttonLeftIconName, type: this.props.buttonLeftIconType}}
                    title= {this.props.buttonLeftTitle}
                    containerStyle={{marginHorizontal: 16}}
                    onPress={((this.props.buttonLeftTitle !== 'Not interested') ? iKnowBtnClicked : goToNextRandomWord)}
                    />
                    <Button
                    icon={{name: this.props.buttonRightIconName, type: this.props.buttonRightIconType}}
                    title= {this.props.buttonRightTitle}
                    containerStyle={{marginHorizontal: 16}}
                    onPress={(this.props.buttonRightTitle !== 'Got it') ? showWordDefinition : gotItBtnClicked}
                    />
                </View>
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
                        let apiUrl = (_.valuesIn(settingsScreen))[0].apiUrl
                        if(apiUrl && apiUrl !== '') {
                            store.dispatch(updateApiUrl(apiUrl))
                            apiRequest = axios.create({
                                baseURL: this.props.apiUrl,
                                headers: {
                                    'X-Mashape-Key': AppConstants.WORDS_API_KEY,
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                }
                            })
                        }
                        else {
                            store.dispatch(updateApiUrl('https://wordsapiv1.p.mashape.com/words/?hasDetails=definitions&random=true'))
                            apiRequest = axios.create({
                                baseURL: this.props.apiUrl,
                                headers: {
                                    'X-Mashape-Key': AppConstants.WORDS_API_KEY,
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                }
                            })  
                        }
                    }
                    else{
                        store.dispatch(updateApiUrl('https://wordsapiv1.p.mashape.com/words/?hasDetails=definitions&random=true'))
                        apiRequest = axios.create({
                            baseURL: this.props.apiUrl,
                            headers: {
                                'X-Mashape-Key': AppConstants.WORDS_API_KEY,
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        })  
                    }
                }
                else {
                    store.dispatch(updateApiUrl('https://wordsapiv1.p.mashape.com/words/?hasDetails=definitions&random=true'))
                    apiRequest = axios.create({
                        baseURL: this.props.apiUrl,
                        headers: {
                            'X-Mashape-Key': AppConstants.WORDS_API_KEY,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }) 
                }     
            })
            goToNextRandomWord();
        })
        .catch((error) => console.log(error))
    }
    componentDidMount() {
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
        apiUrl: state.apiUrl

    }
}

function goToNextRandomWord(){
    apiRequest.get()
    .then((response) => {

        apiResponse = response.data        
        numberOfDefinitions = apiResponse.results.length
        dataGoingToStore = {}
        
        dataGoingToStore = {
        word: apiResponse.word,
        partOfSpeech: (apiResponse.results[0].partOfSpeech ? apiResponse.results[0].partOfSpeech : 'empty'),
        pronunciation: (apiResponse.pronunciation ? (apiResponse.pronunciation.all ? apiResponse.pronunciation.all : 'empty') : 'empty'),
        frequency: (apiResponse.frequency ? apiResponse.frequency.toString() : 'empty'),
        definition: apiResponse.results[0].definition,
        }
        store.dispatch(addResponseData(dataGoingToStore)) 
    })
    .catch((error) => console.error(error))
}

function iKnowBtnClicked() {
    addKnownWordToCloud(dataGoingToStore)
    goToNextRandomWord()
}

function gotItBtnClicked() {
    addKnownWordToCloud(dataGoingToStore)
    goToNextRandomWord()
}

function addKnownWordToCloud(word){
    wordsDetailsCollection.add(word)
    .then((docRef) => {
        docRef.update({id: docRef.id})
        wordsCollection.add({originalId: docRef.id, label: word.word})
    })
}

function showWordDefinition() {
    store.dispatch(displayWordDefinition())
}