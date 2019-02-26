/* global require */

import React from 'react';
import { StyleSheet, ScrollView, View, Text, ToastAndroid, } from 'react-native';
import {  Button, SearchBar } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { BallIndicator } from 'react-native-indicators'
import { inject, observer } from 'mobx-react'
import { autorun } from 'mobx'

import AppConstants from '../Constants'
import reactotron from '../ReactotronConfig'

let firebaseAuth = null
let userId = null
let userWordsDetailsCollection = null

const axios = require('axios');

let apiRequest = null

const Realm = require('realm');
const R = require('ramda');
const _ = require('lodash')

let dataGoingToStore = {}

let apiResponse = {};
let numberOfDefinitions = 0;

class RandomPractice extends React.Component {

    _didFocusSubscription = null;

    hasComponentMounted = false;

    store = this.props.store

    myAutorun = autorun(() => {
        if(this.store.itemDef.length === 0 && this.hasComponentMounted) ToastAndroid.show('No definition found', ToastAndroid.SHORT)
    })


    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: AppConstants.STRING_PRACTICE,
        }
    }

    url = ''

    displayFrequency = 'none';

    goToPreferences = () => this.props.navigation.navigate(AppConstants.STRING_SETTINGS)

    render() {

        return(
            <View style={styles.container}>
                <SearchBar 
                placeholder= {AppConstants.STRING_SEARCH}
                value= {this.store.practiceSpecificWordSearch}
                onChangeText= {(changedText) => this.onSearchValueChanged(changedText)}
                onClear= {this.onSearchValueCleared}
                containerStyle={{marginBottom: 16}}
                returnKeyType='go'
                onSubmitEditing={this.onSearchSubmit}
                />
            {this.store.displayLoadingIndicator === true
            ? 
            <View style={styles.loadingIndicator}>
                <BallIndicator />
            </View>
            :
            <View style={{flex: 1}}>
            <ScrollView style={{marginBottom: 8, flex: 1, maxHeight: 250, display: this.store.displayScrollView}} contentContainerStyle={{flex: 0, justifyContent: 'flex-end'}}>
                <View style={{display: this.store.displayRandomWord}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black'}}>{this.store.itemWord}</Text>
                    <Text style={{fontSize: 18, color: 'black', display: this.store.itemPartOfSpeech === AppConstants.STRING_EMPTY ? 'none' : 'flex'}}>{this.store.itemPartOfSpeech}</Text>
                    <Text style={{fontSize: 18, color: 'black', display: this.store.itemPronunciation === AppConstants.STRING_EMPTY ? 'none' : 'flex'}}>{AppConstants.STRING_PRONUNCIATION} {this.store.itemPronunciation}</Text>
                    <Text style={{fontSize: 18, color: 'black', display: this.store.itemFrequency === AppConstants.STRING_EMPTY ? 'none' : 'flex'}}>{AppConstants.STRING_FREQUENCY} {this.store.itemFrequency}</Text>
                    <Text style={{fontSize: 18, color: 'black', textDecorationLine: 'underline', display: this.store.itemDef.length > 0 ? 'flex' : 'none'}}>{'\n'}{AppConstants.STRING_DEFINITIONS}{'\n'}</Text>
                    { this.store.itemDef.map((element, index, array) => {
                        if(array.length !== 1)
                        return (
                            <View key={index}>
                                <Text style={{fontSize: 18, fontWeight: 'bold'}}>{index + 1}.</Text>
                                <Text style={{fontSize: 18, color: 'black', display: element.partOfSpeech === AppConstants.STRING_EMPTY ? 'none' : 'flex'}}>{element.partOfSpeech}</Text>
                                <Text style={{fontSize: 18, fontStyle: 'italic'}}>{element.definition}{'\n'}</Text>
                            </View>

                        )
                        else
                        return (
                            <View key={index}>
                                <Text style={{fontSize: 18, color: 'black', display: element.partOfSpeech === AppConstants.STRING_EMPTY ? 'none' : 'flex'}}>{element.partOfSpeech}</Text>
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
                    title= {AppConstants.STRING_CHANGE_PREFS}
                    onPress={this.goToPreferences}
                    />
                </View>
                </View>
}
            </View>
        )
    }

    componentDidMount() {
        
        this.hasComponentMounted = true

        this._didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    let settingsScreen = realm.objects(AppConstants.STRING_SETTINGS_SCREEN_REALM_PATH)
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
            .catch((error) => ToastAndroid.show(AppConstants.TOAST_ERROR, ToastAndroid.SHORT))
            })
    
        firebaseAuth = firebase.auth()
        userId = firebaseAuth.currentUser.uid
        userWordsDetailsCollection = firebase.firestore().collection(AppConstants.STRING_WORDS_DETAILS + userId + AppConstants.STRING_USER_WORDS_DETAILS)

        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                if(!(realm.objects(AppConstants.STRING_SETTINGS_SCREEN_REALM_PATH).isEmpty())) {
                    let settingsScreen = realm.objects(AppConstants.STRING_SETTINGS_SCREEN_REALM_PATH)
                    let apiUrl = (_.valuesIn(settingsScreen))[0].apiUrl
                        this.store.updateApiUrl(apiUrl)
                        updateApiRequest(this.store.apiUrl)
                }
                else{
                    realm.create(AppConstants.STRING_SETTINGS_SCREEN_REALM_PATH, { pk: 0 , updatedIndex: 0, startingLettersChecked: false, endingLettersChecked: false, partialLettersChecked: false, onlyPronunciationWordChecked: false, specificWordChecked: false, startingLettersText: '', endingLettersText: '', partialLettersText: '', specificWordText: '', apiUrl: AppConstants.RANDOM_URL})
                    this.store.updateApiUrl(AppConstants.RANDOM_URL)
                    updateApiRequest(this.store.apiUrl)
                }
            })
            this.goToNextRandomWord();
        })
        .catch((error) => ToastAndroid.show(AppConstants.TOAST_ERROR, ToastAndroid.SHORT))
    }

    componentWillUnmount() {
        this.store.resetResponseData()
        this._didFocusSubscription.remove()
        this.myAutorun()
    }

    showNowWordFound = () => R.pipe(
        this.store.displayUpdateChangePrefsBtn,
        () => ToastAndroid.show(AppConstants.TOAST_NO_WORD_FOUND, ToastAndroid.SHORT),
        () => ToastAndroid.show(AppConstants.TOAST_CHANGE_PREFS, ToastAndroid.SHORT)
    )
    

    nextBtnClicked = () => {
        this.goToNextRandomWord()
    }
    
    addToVocabularyBtnClicked = () => {
        this.checkWordAlreadyInVocabulary(dataGoingToStore)
    }

    onSearchValueChanged = (searchValue) => {
        this.store.updatePracticeSpecificWordSearch(searchValue)
    }

    onSearchSubmit = () => {
        updateApiRequest(AppConstants.STRING_COMMON_URL + this.store.practiceSpecificWordSearch)
        this.goToNextRandomWord()
    }

    onSearchValueCleared = () => {
        updateApiRequest(this.store.apiUrl)
        this.goToNextRandomWord()
    }
    
    checkWordAlreadyInVocabulary = (wordObject) => {
        userWordsDetailsCollection.where(AppConstants.STRING_WORD, '==', wordObject.word).get()
        .then((querySnapshot) => {
            if(querySnapshot.empty) {
                addKnownWordToCloud(wordObject)
                this.goToNextRandomWord()
            }
            else {
                ToastAndroid.show(AppConstants.TOAST_ALREADY_IN_VOC, ToastAndroid.SHORT)
            }
        }, (error) => ToastAndroid.show(AppConstants.TOAST_ERROR, ToastAndroid.SHORT))
        .catch((error) => ToastAndroid.show(AppConstants.TOAST_ERROR, ToastAndroid.SHORT))
    }

    goToNextRandomWord = () => {
        this.store.showLoadingIndicator()
        dataGoingToStore = {}
        apiRequest.get()
        .then((response) => {
    
            apiResponse = response.data
            R.ifElse(
                R.hasPath(['results']),
                () => R.pipe(
                    () => numberOfDefinitions = apiResponse.results.length,
                    () => R.ifElse(
                        R.isEmpty,
                        this.showNowWordFound(),
                        () => R.pipe(
                            (() => R.ifElse(
                                R.lt(1),
                                () => R.pipe(getAllDefinitions, R.flip(createDataGoingToStore))(apiResponse)(apiResponse),
                                () => createDataGoingToStore(apiResponse, null)
                            )(apiResponse.results.length)), 
                            this.store.addResponseData)()
                    )(apiResponse.results)),
                () => R.pipe(
                    createDataGoingToStore,
                    this.store.addResponseData
                )(apiResponse, null)
            )(apiResponse)()
        }, 
        this.showNowWordFound())
        .catch((error) => ToastAndroid.show(AppConstants.TOAST_ERROR, ToastAndroid.SHORT))
    }
}

export default inject('store')(observer(RandomPractice))

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const getWordPronunciation = (apiResponse) => R.ifElse(
    R.hasPath(['pronunciation', 'all']),
    () => R.identity(apiResponse.pronunciation.all),
    () => R.identity(apiResponse.pronunciation)
)(apiResponse)

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

const createDataGoingToStore = R.curry((apiResponse, definitions) => {

    let pronunciation, partOfSpeech, definition = null

    if(definitions) {
        return R.pipe(
            () => pronunciation = getWordPronunciation(apiResponse),
            () => R.identity({
                word: apiResponse.word,
                partOfSpeech: (apiResponse.results[0].partOfSpeech ? apiResponse.results[0].partOfSpeech : AppConstants.STRING_EMPTY),
                pronunciation: (pronunciation ? pronunciation : AppConstants.STRING_EMPTY),
                frequency: (apiResponse.frequency ? apiResponse.frequency.toString() : AppConstants.STRING_EMPTY),
                definition: definitions,    
            })
        )()
    }

    return R.pipe(
        () => pronunciation = getWordPronunciation(apiResponse),
        () => R.ifElse(
            R.hasPath(['results']),
            () => R.pipe(
                () => partOfSpeech = (apiResponse.results[0].partOfSpeech ? apiResponse.results[0].partOfSpeech : AppConstants.STRING_EMPTY),
                () => definition = apiResponse.results[0].definition,
                () => R.identity({
                    word: apiResponse.word,
                    partOfSpeech,
                    pronunciation: (pronunciation ? pronunciation : AppConstants.STRING_EMPTY),
                    frequency: (apiResponse.frequency ? apiResponse.frequency.toString() : AppConstants.STRING_EMPTY),
                    definition: [{partOfSpeech, definition}]}))(),
            () => R.identity({
                word: apiResponse.word,
                partOfSpeech: AppConstants.STRING_EMPTY,
                pronunciation: (pronunciation ? pronunciation : AppConstants.STRING_EMPTY),
                frequency: (apiResponse.frequency ? apiResponse.frequency.toString() : AppConstants.STRING_EMPTY),
                definition: []    
            })
        )(apiResponse)
    )()
})

const getAllDefinitions = (apiResponse) => {
    let definitions = []
    R.forEachObjIndexed((value) => {
        let partOfSpeech = (value.partOfSpeech ? value.partOfSpeech : AppConstants.STRING_EMPTY)
        let definition = value.definition
        definitions.push({partOfSpeech, definition})
    }, apiResponse.results)
    return definitions
}
