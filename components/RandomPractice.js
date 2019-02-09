import React from 'react';
import { StyleSheet, ScrollView, View, Text, ToastAndroid } from 'react-native';
import {  Button } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { BallIndicator } from 'react-native-indicators'
import { inject, observer } from 'mobx-react'
import { autorun } from 'mobx'

import AppConstants from '../Constants'
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

    _didFocusSubscription = null;

    store = this.props.store

    myAutorun = autorun(() => {
        reactotron.logImportant('url : ', this.store.apiUrl)
    })


    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: 'Practice',
        }
    }

    url = ''

    displayFrequency = 'none';

    goToPreferences = () => this.props.navigation.navigate('Settings')

    render() {

        if(this.store.displayLoadingIndicator === true) {
            return (
                <View style={styles.loadingIndicator}>
                    <BallIndicator />
                </View>
            )
        }
        return(
            <View style={styles.container}>
            <ScrollView style={{marginBottom: 8, flexGrow: 1, flex: 1, display: this.store.displayScrollView}}>
                <View style={{display: this.store.displayRandomWord}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black'}}>{this.store.itemWord}</Text>
                    <Text style={{fontSize: 18, color: 'black'}}>{this.store.itemPartOfSpeech}</Text>
                    <Text style={{fontSize: 18, color: 'black'}}>Pronunciation : {this.store.itemPronunciation}</Text>
                    <Text style={{fontSize: 18, color: 'black'}}>Frequency of : {this.store.itemFrequency}{'\n'}</Text>
                    <Text style={{fontSize: 18, color: 'black', textDecorationLine: 'underline'}}>Definitions{'\n'}</Text>
                    {this.store.itemDef.map((element, index, array) => {
                        if(array.length !== 1)
                        return (
                            <View key={index}>
                                <Text style={{fontSize: 18, fontWeight: 'bold'}}>{index + 1}.</Text>
                                <Text style={{fontSize: 18, color: 'black'}}>{element.partOfSpeech}</Text>
                                <Text style={{fontSize: 18, fontStyle: 'italic'}}>{element.definition}{'\n'}</Text>
                            </View>

                        )
                        else
                        return (
                            <View key={index}>
                                <Text style={{fontSize: 18, color: 'black'}}>{element.partOfSpeech}</Text>
                                <Text style={{fontSize: 18, fontStyle: 'italic'}}>{element.definition}</Text>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
                <View style={[styles.buttonGroup, {display: this.store.displayButtons}]}>
                    <Button
                    icon={{name: this.store.buttonLeftIconName, type: this.store.buttonLeftIconType}}
                    title= {this.store.buttonLeftTitle}
                    containerStyle={{marginHorizontal: 16}}
                    onPress={() => this.addToVocabularyBtnClicked()}
                    />
                    <Button
                    icon={{name: this.store.buttonRightIconName, type: this.store.buttonRightIconType}}
                    title= {this.store.buttonRightTitle}
                    containerStyle={{marginHorizontal: 16}}
                    onPress={() => this.nextBtnClicked()}
                    onLongPress={() => this.addToVocabularyBtnClicked()}
                    />
                </View>
                <View style={[styles.buttonGroup, {display: this.store.displayChangePrefsBtn}]}>
                <Button
                    title= 'CHANGE RANDOM PRACTICE PREFERENCES'
                    onPress={this.goToPreferences}
                    />
                </View>
            </View>
        )
    }

    componentDidMount() {

        this._didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    let settingsScreen = realm.objects('settingsScreen')
                    let apiUrl = (_.valuesIn(settingsScreen))[0].apiUrl
                    if(apiUrl && apiUrl !== '') {
                        if(this.store.apiUrl !== apiUrl) {
                            this.store.updateApiUrl(apiUrl)
                            updateApiRequest(this.store.apiUrl)
                        }
                    }
                    if(this.store.displayChangePrefsBtn === 'flex'){
                        this.goToNextRandomWord()
                    }
                    })
                })
            .catch((error) => console.log(error))
            })
    
        firebaseAuth = firebase.auth()
        userId = firebaseAuth.currentUser.uid
        userWordsDetailsCollection = firebase.firestore().collection('wordsDetails/' + userId + '/userWordsDetails')

        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                if(!(realm.objects('settingsScreen').isEmpty())) {
                    let settingsScreen = realm.objects('settingsScreen')
                    let apiUrl = (_.valuesIn(settingsScreen))[0].apiUrl
                        this.store.updateApiUrl(apiUrl)
                        updateApiRequest(this.store.apiUrl)
                }
                else{
                    realm.create('settingsScreen', { pk: 0 , updatedIndex: 0, startingLettersChecked: false, endingLettersChecked: false, partialLettersChecked: false, onlyPronunciationWordChecked: false, specificWordChecked: false, startingLettersText: '', endingLettersText: '', partialLettersText: '', specificWordText: '', apiUrl: AppConstants.RANDOM_URL})
                    this.store.updateApiUrl(AppConstants.RANDOM_URL)
                    updateApiRequest(this.store.apiUrl)
                }
            })
            this.goToNextRandomWord();
        })
        .catch((error) => console.log(error))
    }

    componentWillUnmount() {
        this.store.resetResponseData()
        this._didFocusSubscription.remove()
        this.myAutorun()
    }

    nextBtnClicked = () => {
        this.goToNextRandomWord()
    }
    
    addToVocabularyBtnClicked = () => {
        this.checkWordAlreadyInVocabulary(dataGoingToStore)
    }
    
    checkWordAlreadyInVocabulary = (wordObject) => {
        userWordsDetailsCollection.where('word', '==', wordObject.word).get()
        .then((querySnapshot) => {
            if(querySnapshot.empty) {
                addKnownWordToCloud(wordObject)
                this.goToNextRandomWord()
            }
            else {
                ToastAndroid.show('Word/expression already in vocabulary', ToastAndroid.SHORT)
            }
        }, (error) => reactotron.logImportant('Error occured : ' + error))
        .catch((error) => reactotron.logImportant('Error occured : ', error))
    }

    goToNextRandomWord = () => {
        this.store.showLoadingIndicator()
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
                this.store.addResponseData(dataGoingToStore)
            
            }
            else {
                this.store.displayUpdateChangePrefsBtn()
                ToastAndroid.show('No word/expression matching preferences found', ToastAndroid.SHORT)
                ToastAndroid.show('Please change preferences in settings', ToastAndroid.SHORT)
            }
        }, () => {
            this.store.displayUpdateChangePrefsBtn()
            ToastAndroid.show('No word/expression matching preferences found', ToastAndroid.SHORT)
            ToastAndroid.show('Please change preferences in settings', ToastAndroid.SHORT)
        })
        .catch((error) => console.error(error))
    }
}

export default inject('store')(observer(RandomPractice))

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
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const addKnownWordToCloud = (word) => {
    userWordsDetailsCollection.add(word)
    .then((docRef) => {
        docRef.update({id: docRef.id, numberOfRemembrances: 1, numberOfAppearances: 1})
    })
}

const updateApiRequest = (baseURL) => {
    apiRequest = axios.create({
        baseURL: baseURL,
        headers: {
            'X-Mashape-Key': AppConstants.WORDS_API_KEY,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

const createDataGoingToStore = (apiResponse, definitions= null) => {
    if(definitions) {
        let pronunciation = null

        if(_.hasIn(apiResponse, 'pronunciation.all'))
            pronunciation = apiResponse.pronunciation.all
        else pronunciation = apiResponse.pronunciation
        return {
            word: apiResponse.word,
            partOfSpeech: (apiResponse.results[0].partOfSpeech ? apiResponse.results[0].partOfSpeech : 'empty'),
            pronunciation: (pronunciation ? pronunciation : 'empty'),
            frequency: (apiResponse.frequency ? apiResponse.frequency.toString() : 'empty'),
            definition: definitions,    
        }
    }
    let pronunciation = null

    if(_.hasIn(apiResponse, 'pronunciation.all'))
        pronunciation = apiResponse.pronunciation.all
    else pronunciation = apiResponse.pronunciation

    let partOfSpeech = (apiResponse.results[0].partOfSpeech ? apiResponse.results[0].partOfSpeech : 'empty')
    let definition = apiResponse.results[0].definition
    return {
        word: apiResponse.word,
        partOfSpeech,
        pronunciation: (pronunciation ? pronunciation : 'empty'),
        frequency: (apiResponse.frequency ? apiResponse.frequency.toString() : 'empty'),
        definition: [{partOfSpeech, definition}]
    }
}

const getAllDefinitions = (apiResponse, numberOfDefinitions) => {
    let definitions = []
    for(let i= 0; i < numberOfDefinitions; i++) {
        let partOfSpeech = (apiResponse.results[i].partOfSpeech ? apiResponse.results[i].partOfSpeech : 'empty')
        let definition = apiResponse.results[i].definition
        definitions.push({partOfSpeech, definition})
    }
    return definitions
}
