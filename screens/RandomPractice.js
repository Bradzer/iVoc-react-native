/* global require */

import React from 'react';
import { StyleSheet, ScrollView, View, Text, ToastAndroid, } from 'react-native';
import {  Button, SearchBar } from 'react-native-elements'
import firebase from 'react-native-firebase'
import { BallIndicator } from 'react-native-indicators'
import { inject, observer } from 'mobx-react'
import { autorun } from 'mobx'
import { NavigationEvents } from 'react-navigation';

import AppConstants from '../constants/Constants'
import BanTypes from '../constants/BanTypes'

const firebaseAuth = firebase.auth()
let userId = null
let userWordsDetailsCollection = null
const blackListCollection = firebase.firestore().collection('blacklist')

const axios = require('axios');

let apiRequest = null

const Realm = require('realm');

const _ = require('lodash')

let dataGoingToStore = {}

let apiResponse = {};
let numberOfDefinitions = 0;

let isSearchingWithSearchBar = false;

class RandomPractice extends React.Component {

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
                <NavigationEvents
                    onDidFocus={() => this.onDidFocus()}
                    onWillBlur={() => this.onWillBlur()}
                />
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
        this.myAutorun()
    }

    onDidFocus = () => {
        this.manageAccountStatus()
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
}

    onWillBlur = () => {
    }

    manageAccountStatus = () => {
        blackListCollection.where('id', '==', userId).get()
        .then((querySnapshot) => {
            if(!querySnapshot.empty) {
                signOut()
                querySnapshot.forEach((docSnapshot) => {
                    switch(docSnapshot.data().banType) {
                        case BanTypes.DELETED:
                            ToastAndroid.show(AppConstants.TOAST_ACCOUNT_DELETED, ToastAndroid.SHORT)
                            break;

                        case BanTypes.DISABLED:
                            ToastAndroid.show(AppConstants.TOAST_ACCOUNT_DISABLED, ToastAndroid.SHORT)
                            break;
                    }
                })
            }
        },
        () => ToastAndroid.show(AppConstants.TOAST_ERROR, ToastAndroid.SHORT))
    }

    nextBtnClicked = () => {
        this.goToNextRandomWord()
    }
    
    addToVocabularyBtnClicked = () => {
        this.checkWordAlreadyInVocabulary(dataGoingToStore)
    }

    onSearchValueChanged = (searchValue) => {
        isSearchingWithSearchBar = false
        this.store.updatePracticeSpecificWordSearch(searchValue)
    }

    onSearchSubmit = () => {
        isSearchingWithSearchBar = true
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
                ToastAndroid.show(AppConstants.TOAST_WORD_ADDED_IN_VOC, ToastAndroid.SHORT)
                if(!isSearchingWithSearchBar) this.goToNextRandomWord()
            }
            else {
                ToastAndroid.show(AppConstants.TOAST_ALREADY_IN_VOC, ToastAndroid.SHORT)
            }
        }, (error) => ToastAndroid.show(AppConstants.TOAST_ERROR, ToastAndroid.SHORT))
        .catch((error) => ToastAndroid.show(AppConstants.TOAST_ERROR, ToastAndroid.SHORT))
    }

    goToNextRandomWord = () => {
        this.store.showLoadingIndicator()
        let definitions = ''
        dataGoingToStore = {}
        apiRequest.get()
        .then((response) => {
    
            apiResponse = response.data
            if(_.hasIn(apiResponse, 'results')) {
                numberOfDefinitions = apiResponse.results.length
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
                    ToastAndroid.show(AppConstants.TOAST_NO_WORD_FOUND, ToastAndroid.SHORT)
                    ToastAndroid.show(AppConstants.TOAST_CHANGE_PREFS, ToastAndroid.SHORT)
                }    
            }
            else {
                dataGoingToStore = createDataGoingToStore(apiResponse)
                this.store.addResponseData(dataGoingToStore)
            }      
        }, () => {
            this.store.displayUpdateChangePrefsBtn()
            ToastAndroid.show(AppConstants.TOAST_NO_WORD_FOUND, ToastAndroid.SHORT)
            ToastAndroid.show(AppConstants.TOAST_CHANGE_PREFS, ToastAndroid.SHORT)
    })
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
            partOfSpeech: (apiResponse.results[0].partOfSpeech ? apiResponse.results[0].partOfSpeech : AppConstants.STRING_EMPTY),
            pronunciation: (pronunciation ? pronunciation : AppConstants.STRING_EMPTY),
            frequency: (apiResponse.frequency ? apiResponse.frequency.toString() : AppConstants.STRING_EMPTY),
            definition: definitions,    
        }
    }
    let pronunciation = null

    if(_.hasIn(apiResponse, 'pronunciation.all'))
        pronunciation = apiResponse.pronunciation.all
    else pronunciation = apiResponse.pronunciation

    if(_.hasIn(apiResponse, 'results')) {
        let partOfSpeech = (apiResponse.results[0].partOfSpeech ? apiResponse.results[0].partOfSpeech : AppConstants.STRING_EMPTY)
        let definition = apiResponse.results[0].definition
        return {
            word: apiResponse.word,
            partOfSpeech,
            pronunciation: (pronunciation ? pronunciation : AppConstants.STRING_EMPTY),
            frequency: (apiResponse.frequency ? apiResponse.frequency.toString() : AppConstants.STRING_EMPTY),
            definition: [{partOfSpeech, definition}]
        }    
    }
    else {
        return {
            word: apiResponse.word,
            partOfSpeech: AppConstants.STRING_EMPTY,
            pronunciation: (pronunciation ? pronunciation : AppConstants.STRING_EMPTY),
            frequency: (apiResponse.frequency ? apiResponse.frequency.toString() : AppConstants.STRING_EMPTY),
            definition: []
        }    
    }
}

const getAllDefinitions = (apiResponse, numberOfDefinitions) => {
    let definitions = []
    for(let i= 0; i < numberOfDefinitions; i++) {
        let partOfSpeech = (apiResponse.results[i].partOfSpeech ? apiResponse.results[i].partOfSpeech : AppConstants.STRING_EMPTY)
        let definition = apiResponse.results[i].definition
        definitions.push({partOfSpeech, definition})
    }
    return definitions
}

function signOut() {
    firebaseAuth.signOut()
}