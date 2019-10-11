/* global require */

import { decorate, observable, action } from "mobx"
import { ToastAndroid, } from 'react-native'

import AppConstants from '../constants/Constants'
import Strings from '../constants/Strings'
import Toasts from '../constants/Toasts'
import SortTypes from '../constants/SortTypes'

const Realm = require('realm');

const _ = require('lodash');

const commonUrlpart = Strings.STRING_COMMON_URL

class State {

    //attributes
    closeHomeMenu= false
    closeVocMenu= false
    closeSettingsMenu= false
    isHomeMenuOpen= false
    isVocMenuOpen= false
    isSettingsMenuOpen= false
    practiceSpecificWordSearch= ''
    itemDef= []
    itemSynonyms= ''
    itemExamples= ''
    itemWord= ''
    itemPartOfSpeech= ''
    itemPronunciation= ''
    itemFrequency= ''
    displayRandomWord= 'none'
    displayButtons= 'none'
    displayScrollView= 'none'
    displayWordDefinition= 'none'
    buttonRightIconName= 'controller-next'
    buttonRightIconType= 'entypo'
    buttonRightTitle= "Skip"
    buttonLeftIconName= 'add-to-list'
    buttonLeftIconType='entypo'
    buttonLeftTitle="Add to vocabulary"
    displayChangePrefsBtn= 'none'
    selectedPartOfSpeechIndex= 0
    startingLettersChecked= false
    endingLettersChecked= false
    realm= null
    startingLettersText= ''
    endingLettersText= ''
    apiUrl= ''
    closeMenu= false
    isSortBy= false
    multiDeletionMenuOption= 'Enable multi deletion'
    isVocabularyClearDone= false
    multiDeletionStatus= false
    vocabularyListPulseAnimation= null
    vocabularyOverlayDisplay= false
    vocabularyWord= ''
    vocabularyPartOfSpeech= ''
    vocabularyDefinition= []
    vocabularyPronunciation= ''
    vocabularyFrequency= ''
    specificWordChecked= false
    specificWordText= ''
    randomWordPrefDisplay= 'flex'
    listOfWords= []
    defaultListOfWords= []
    searchBarValue= ''
    reviewIntroTextDisplay= 'none'
    displayReviewContent= 'none'
    displayReviewHint= 'none'
    reviewWord= ''
    reviewOverlayDisplay= false
    reviewPronunciation= ''
    reviewFrequency= ''
    reviewDefinition= []
    reviewOriginalId= ''
    partialLettersChecked= false
    partialLettersText= ''
    displayLoadingIndicator= true
    reviewStartingLetter= ''
    reviewEndingLetter= ''
    currentRewiewDefinition= ''
    reviewAnswerText= ''
    isNoVocabulary= false
    isReviewOver= false
    onlyPronunciationWordChecked= false
    defaultChecked= true
    alphabeticalChecked= false
    alphabeticalReverseChecked= false
    lengthChecked= false
    lengthDescendingChecked= false
    sortType= SortTypes.DEFAULT

    //actions
    setCloseHomeMenu = action((status) => {
        this.closeHomeMenu = status
    })

    setHomeMenuOpen = action((status) => {
        this.isHomeMenuOpen = status
    })

    setCloseVocMenu = action((status) => {
        this.closeVocMenu = status
    })

    setVocMenuOpen = action((status) => {
        this.isVocMenuOpen = status
    })

    setCloseSettingsMenu = action((status) => {
        this.closeSettingsMenu = status
    })

    setSettingsMenuOpen = action((status) => {
        this.isSettingsMenuOpen = status
    })

    updateApiUrl = action((apiUrl) => {
        this.apiUrl = apiUrl
    })

    resetResponseData = action(() => {
        this.itemWord= ''
        this.itemPartOfSpeech= ''
        this.itemPronuncitation= ''
        this.itemFrequency= ''
        this.practiceSpecificWordSearch=''
        this.displayRandomWord= 'none'
        this.displayButtons= 'none'
        this.displayWordDefinition= 'none'
        this.displayChangePrefsBtn = 'none'
    })

    showLoadingIndicator = action(() => {
        this.displayLoadingIndicator = true
    })

    hideLoadingIndicator = action(() => {
        this.displayLoadingIndicator = false
    })

    updatePracticeSpecificWordSearch = action((searchValue) => {
        this.practiceSpecificWordSearch = searchValue
    })

    addResponseData = action((dataGoingToStore) => {
        this.itemWord= dataGoingToStore.word
        this.itemPartOfSpeech= dataGoingToStore.partOfSpeech
        this.itemPronunciation= dataGoingToStore.pronunciation
        this.itemFrequency= dataGoingToStore.frequency
        this.itemDef= dataGoingToStore.definition
        this.displayRandomWord= 'flex'
        this.displayButtons= 'flex'
        this.displayWordDefinition= 'none'
        this.displayScrollView= 'flex'
        this.displayChangePrefsBtn= 'none'
        this.hideLoadingIndicator()
    })

    displayUpdateChangePrefsBtn = action(() => {
        this.displayChangePrefsBtn= 'flex'
        this.displayButtons= 'none'
        this.displayScrollView= 'none'
        this.hideLoadingIndicator()
    })

    showNoVocabulary = action(() => {
        this.isNoVocabulary= true
        this.hideLoadingIndicator()
    })

    resetReviewLayout = action(() => {
        this.reviewDefinition= []
        this.reviewStartingLetter= ''
        this.reviewEndingLetter= ''
        this.currentRewiewDefinition= ''
        this.reviewAnswerText= ''
        this.isNoVocabulary= false
        this.isReviewOver= false
        this.displayReviewContent= 'none'
        this.displayReviewHint= 'none'
    })

    updateReviewContent = action((randomWord, randomDefIndex) => {
        if(getNumberOfLettersHint(randomWord.word.length) > 0) {
            this.displayReviewHint = 'flex'
            this.reviewStartingLetter= randomWord.word.substring(0, getNumberOfLettersHint(randomWord.word.length)/2)
            this.reviewEndingLetter= randomWord.word.substring(randomWord.word.length - (getNumberOfLettersHint(randomWord.word.length)/2))
        }
        else this.displayReviewHint = 'none'

        this.currentRewiewDefinition= randomWord.definition[randomDefIndex].definition
        this.reviewWord= randomWord.word
        this.reviewPronunciation= randomWord.pronunciation
        this.reviewFrequency= randomWord.frequency
        this.reviewDefinition= randomWord.definition
        this.reviewAnswerText = ''
        this.displayLoadingIndicator= false
        this.displayReviewContent= 'flex'
    })

    displayReviewOverlay = action(() => {
        this.reviewOverlayDisplay= true
    })

    hideReviewOverlay = action(() => {
        this.reviewOverlayDisplay= false
    })

    showReviewOver = action(() => {
        this.isReviewOver= true
    })

    updateReviewAnswerTextValue = action((changedText) => {
        this.reviewAnswerText= changedText
    })

    updateSettingsPreferences = action((settingsPreferencesInRealm) => {
        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                realm.objects('settingsScreen').filtered('pk = 0').update('partOfSpeechIndex', settingsPreferencesInRealm.partOfSpeechIndex)
                realm.objects('settingsScreen').filtered('pk = 0').update('startingLettersChecked', settingsPreferencesInRealm.startingLettersChecked)
                realm.objects('settingsScreen').filtered('pk = 0').update('endingLettersChecked', settingsPreferencesInRealm.endingLettersChecked)
                realm.objects('settingsScreen').filtered('pk = 0').update('partialLettersChecked', settingsPreferencesInRealm.partialLettersChecked)
                realm.objects('settingsScreen').filtered('pk = 0').update('specificWordChecked', settingsPreferencesInRealm.specificWordChecked)
                realm.objects('settingsScreen').filtered('pk = 0').update('startingLettersText', settingsPreferencesInRealm.startingLettersText)
                realm.objects('settingsScreen').filtered('pk = 0').update('endingLettersText', settingsPreferencesInRealm.endingLettersText)
                realm.objects('settingsScreen').filtered('pk = 0').update('partialLettersText', settingsPreferencesInRealm.partialLettersText)
                realm.objects('settingsScreen').filtered('pk = 0').update('specificWordText', settingsPreferencesInRealm.specificWordText)
                realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', settingsPreferencesInRealm.apiUrl)
            })
        })
        .catch(() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))

        this.selectedPartOfSpeechIndex= settingsPreferencesInRealm.partOfSpeechIndex
        this.startingLettersChecked= settingsPreferencesInRealm.startingLettersChecked
        this.endingLettersChecked= settingsPreferencesInRealm.endingLettersChecked
        this.partialLettersChecked= settingsPreferencesInRealm.partialLettersChecked
        this.onlyPronunciationWordChecked= settingsPreferencesInRealm.onlyPronunciationWordChecked
        this.startingLettersText= settingsPreferencesInRealm.startingLettersText
        this.endingLettersText= settingsPreferencesInRealm.endingLettersText
        this.partialLettersText= settingsPreferencesInRealm.partialLettersText
        this.apiUrl= settingsPreferencesInRealm.apiUrl
        this.specificWordChecked= settingsPreferencesInRealm.specificWordChecked
        this.specificWordText= settingsPreferencesInRealm.specificWordText
        this.randomWordPrefDisplay= settingsPreferencesInRealm.specificWordChecked ? 'none' : 'flex'
    })

    updateIndex = action((selectedPartOfSpeechIndex) => {
        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                realm.objects('settingsScreen').filtered('pk = 0').update('partOfSpeechIndex', selectedPartOfSpeechIndex)
    
                let settingsScreen = realm.objects('settingsScreen')
                let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))
                
                realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
            })
        })
        .catch(() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))
    
        this.selectedPartOfSpeechIndex= selectedPartOfSpeechIndex
    })

    updateStartingLettersCheckBox = action((currentStatus) => {

        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                realm.objects('settingsScreen').filtered('pk = 0').update('startingLettersChecked', !currentStatus)

                let settingsScreen = realm.objects('settingsScreen')
                let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))

                realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
            })
        })
        .catch(() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))

        this.startingLettersChecked= !currentStatus
        this.specificWordChecked= false
    })

    updateEndingLettersCheckBox = action((currentStatus) => {
        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                realm.objects('settingsScreen').filtered('pk = 0').update('endingLettersChecked', !currentStatus)

                let settingsScreen = realm.objects('settingsScreen')
                let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))

                realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
            })
        })
        .catch(() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))

        this.endingLettersChecked= !currentStatus
        this.specificWordChecked= false
    })

    updateSpecificWordCheckBox = action((currentStatus) => {
        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                realm.objects('settingsScreen').filtered('pk = 0').update('specificWordChecked', !currentStatus)
                let settingsScreen = realm.objects('settingsScreen')
                let specificWordText = ((_.valuesIn(settingsScreen))[0].specificWordText).toLowerCase()

                if(!(currentStatus) && specificWordText) {
                    realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + specificWordText)
                }
                else {
                    realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', AppConstants.RANDOM_URL)
                }
            })
        })
        .catch(() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))

        this.specificWordChecked= !currentStatus
        this.randomWordPrefDisplay= (currentStatus ? 'flex' : 'none')
    })

    updatePartialWordCheckbox = action((currentStatus) => {
        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                realm.objects('settingsScreen').filtered('pk = 0').update('partialLettersChecked', !currentStatus)

                let settingsScreen = realm.objects('settingsScreen')
                let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))

                realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
            })
        })
        .catch(() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))

        this.partialLettersChecked= !currentStatus
        this.specificWordChecked= false
    })

    updatePronunciationCheckbox = action((currentStatus) => {
        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                realm.objects('settingsScreen').filtered('pk = 0').update('onlyPronunciationWordChecked', !currentStatus)

                let settingsScreen = realm.objects('settingsScreen')
                let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))

                realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
            })
        })
        .catch(() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))

        this.onlyPronunciationWordChecked= !currentStatus
    })

    updateStartingLettersText = action((changedText) => {
        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                realm.objects('settingsScreen').filtered('pk = 0').update('startingLettersText', changedText)

                let settingsScreen = realm.objects('settingsScreen')
                let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))

                realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
            })
        })
        .catch(() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))

        this.startingLettersText= changedText
    })

    updateEndingLettersText = action((changedText) => {
        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                realm.objects('settingsScreen').filtered('pk = 0').update('endingLettersText', changedText)

                let settingsScreen = realm.objects('settingsScreen')
                let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))
                
                realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
            })
        })
        .catch(() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))

        this.endingLettersText= changedText
    })

    updatePartialLettersText = action((changedText) => {
        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                realm.objects('settingsScreen').filtered('pk = 0').update('partialLettersText', changedText)

                let settingsScreen = realm.objects('settingsScreen')
                let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))
                
                realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
            })
        })
        .catch(() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))

        this.partialLettersText= changedText
    })

    updateSpecificWordText = action((changedText) => {
        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                realm.objects('settingsScreen').filtered('pk = 0').update('specificWordText', changedText)
                realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + changedText)
            })
        })
        .catch(() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))

        this.specificWordText= changedText
    })

    setCloseMenu = action((status) => {
        this.closeMenu = status
    })
    
    setIsSortBy = action((status) => {
        this.isSortBy = status
    })
    
    setVocabularyClearDone = action((status) => {
        this.isVocabularyClearDone = status
    })
    enableMultiDeletionMenuOption = action(() => {
        this.multiDeletionMenuOption = 'Enable multi deletion'
    })

    disableMultiDeletionMenuOption = action(() => {
        this.multiDeletionMenuOption = 'Disable multi deletion'
    })

    setMultiDeletionStatus = action((status) => {
        this.multiDeletionStatus = status
    })

    enableVocabularyListPulseAnimation = action(() => {
        this.vocabularyListPulseAnimation = 'pulse'
    })

    disableVocabularyListPulseAnimation = action(() => {
        this.vocabularyListPulseAnimation = null
    })
    displayVocabularyOverlay = action((wordDetails) => {
        this.vocabularyOverlayDisplay= true
        this.vocabularyWord= wordDetails.word
        this.vocabularyPartOfSpeech= wordDetails.partOfSpeech
        this.vocabularyDefinition= wordDetails.definition
        this.vocabularyPronunciation= wordDetails.pronunciation
        this.vocabularyFrequency= wordDetails.frequency
    })

    hideVocabularyOverlay = action(() => {
        this.vocabularyOverlayDisplay= false
    })

    deleteWordInList = action((indexOfDeletion) => {
        this.listOfWords= this.listOfWords.filter((value, index) => index !== indexOfDeletion)
    })

    updateSearchValue = action((changedText) => {
        this.searchBarValue= changedText
    })

    updateListOfWords = action((listOfWords) => {
        this.listOfWords= listOfWords
        this.hideLoadingIndicator()
    })

    updateDefaultListOfWords = action(() => {
        this.defaultListOfWords = this.listOfWords
    })

    updateSearchResults = action((changedText) => {
        this.listOfWords= this.listOfWords.filter((value) => value.word.includes(changedText))
    })

    enableDefaultSort = action(() => {
        this.defaultChecked= true
        this.alphabeticalChecked= false
        this.alphabeticalReverseChecked= false
        this.lengthChecked= false
        this.lengthDescendingChecked= false
        this.sortType= SortTypes.DEFAULT       

        this.listOfWords= this.defaultListOfWords
    })

    enableAlphabeticalSort = action(() => {
        this.defaultChecked= false
        this.alphabeticalChecked= true
        this.alphabeticalReverseChecked= false
        this.lengthChecked= false
        this.lengthDescendingChecked= false
        this.sortType= SortTypes.ALPHABETICAL
        
        this.sortAlphabetical()
    })

    enableAlphabeticalReverseSort = action(() => {
        this.defaultChecked= false
        this.alphabeticalChecked= false
        this.alphabeticalReverseChecked= true
        this.lengthChecked= false
        this.lengthDescendingChecked= false
        this.sortType= SortTypes.ALPHABETICAL_REVERSE   
        
        this.sortAlphabeticalReverse()
    })

    enableLengthSort = action(() => {
        this.defaultChecked= false
        this.alphabeticalChecked= false
        this.alphabeticalReverseChecked= false
        this.lengthChecked= true
        this.lengthDescendingChecked= false  
        this.sortType= SortTypes.LENGTH  

        this.sortLength()
    })

    enableLengthDescendingSort = action(() => {
        this.defaultChecked= false
        this.alphabeticalChecked= false
        this.alphabeticalReverseChecked= false
        this.lengthChecked= false
        this.lengthDescendingChecked= true
        this.sortType= SortTypes.LENGTH_DESCENDING  
        
        this.sortLengthDescending()
    })

    sortAlphabetical = action(() => {
        this.listOfWords = sortAlphabetical(this.listOfWords)
    })

    sortAlphabeticalReverse = action (() => {
        this.listOfWords = sortAlphabeticalReverse(this.listOfWords)
    })

    sortLength = action(() => {
        this.listOfWords = sortLength(this.listOfWords)
    })

    sortLengthDescending = action(() => {
        this.listOfWords = sortLengthDescending(this.listOfWords)
    })
}

decorate(State, {
    closeHomeMenu: observable,
    closeVocMenu: observable,
    closeSettingsMenu: observable,
    isHomeMenuOpen: observable,
    isVocMenuOpen: observable,
    isSettingsMenuOpen: observable,
    practiceSpecificWordSearch: observable,
    itemDef: observable,
    itemSynonyms: observable,
    itemExamples: observable,
    itemWord: observable,
    itemPartOfSpeech: observable,
    itemPronunciation: observable,
    itemFrequency: observable,
    displayRandomWord: observable,
    displayButtons: observable,
    displayScrollView: observable,
    displayWordDefinition: observable,
    buttonRightIconName: observable,
    buttonRightIconType: observable,
    buttonRightTitle: observable,
    buttonLeftIconName: observable,
    buttonLeftIconType: observable,
    buttonLeftTitle: observable,
    displayChangePrefsBtn: observable,
    selectedPartOfSpeechIndex: observable,
    startingLettersChecked: observable,
    endingLettersChecked: observable,
    realm: observable,
    startingLettersText: observable,
    endingLettersText: observable,
    apiUrl: observable,
    closeMenu: observable,
    isSortBy: observable,
    multiDeletionMenuOption: observable,
    isVocabularyClearDone: observable,
    multiDeletionStatus: observable,
    vocabularyListPulseAnimation: observable,
    vocabularyOverlayDisplay: observable,
    vocabularyWord: observable,
    vocabularyPartOfSpeech: observable,
    vocabularyDefinition: observable,
    vocabularyPronunciation: observable,
    vocabularyFrequency: observable,
    specificWordChecked: observable,
    specificWordText: observable,
    randomWordPrefDisplay: observable,
    listOfWords: observable,
    defaultListOfWords: observable,
    searchBarValue: observable,
    reviewIntroTextDisplay: observable,
    displayReviewContent: observable,
    reviewWord: observable,
    reviewOverlayDisplay: observable,
    reviewPronunciation: observable,
    reviewFrequency: observable,
    reviewDefinition: observable,
    reviewOriginalId: observable,
    partialLettersChecked: observable,
    partialLettersText:observable,
    displayLoadingIndicator: observable,
    reviewStartingLetter: observable,
    reviewEndingLetter: observable,
    currentRewiewDefinition: observable,
    reviewAnswerText: observable,
    isNoVocabulary: observable,
    isReviewOver: observable,
    onlyPronunciationWordChecked: observable,
    defaultChecked: observable,
    alphabeticalChecked: observable,
    alphabeticalReverseChecked: observable,
    lengthChecked: observable,
    lengthDescendingChecked: observable,
    sortType: observable,
})
const store = new State()

export default store

function getPreferencesData(settingsScreen) {

    let partOfSpeechIndex = (_.valuesIn(settingsScreen))[0].partOfSpeechIndex
    let startingLettersChecked = (_.valuesIn(settingsScreen))[0].startingLettersChecked
    let endingLettersChecked = (_.valuesIn(settingsScreen))[0].endingLettersChecked
    let partialLettersChecked = (_.valuesIn(settingsScreen))[0].partialLettersChecked
    let onlyPronunciationWordChecked = (_.valuesIn(settingsScreen))[0].onlyPronunciationWordChecked
    let startingLettersText = (_.valuesIn(settingsScreen))[0].startingLettersText
    let endingLettersText = (_.valuesIn(settingsScreen))[0].endingLettersText
    let partialLettersText = (_.valuesIn(settingsScreen))[0].partialLettersText

    startingLettersText = _.escapeRegExp(startingLettersText)
    endingLettersText =  _.escapeRegExp(endingLettersText)
    partialLettersText =  _.escapeRegExp(partialLettersText)
    
    let preferencesData = {
        partOfSpeechIndex,
        startingLettersChecked,
        endingLettersChecked,
        partialLettersChecked,
        onlyPronunciationWordChecked,
        startingLettersText,
        endingLettersText,
        partialLettersText,
    }
    return preferencesData
  }

  function getCustomUrlPart(preferencesData) {

    let customUrl = ''
    const { startingLettersChecked, endingLettersChecked, partialLettersChecked, onlyPronunciationWordChecked, partOfSpeechIndex, startingLettersText, endingLettersText, partialLettersText } = preferencesData
    
    if(startingLettersChecked && startingLettersText ) {
        if (endingLettersChecked && endingLettersText) {
            if(partialLettersChecked && partialLettersText) {
                switch(partOfSpeechIndex) {

                    case 1:
                        customUrl += '?partOfSpeech=verb&'
                        break
    
                    case 2:
                        customUrl += '?partOfSpeech=noun&'
                        break
                    case 3:
                        customUrl += '?partOfSpeech=adjective&'
                        break;

                    case 4:
                        customUrl += '?partOfSpeech=adverb&'
                        break;
                    
                    default:
                        customUrl += '?'
                        break
                }
    
                let startingLettersTextLower = startingLettersText.toLowerCase()
                let endingLettersTextLower = endingLettersText.toLowerCase()
                let partialLettersTextLower = partialLettersText.toLowerCase()
    
                customUrl += 'letterPattern=^' + startingLettersTextLower + '.*' + partialLettersTextLower + '.*' + endingLettersTextLower + '$&hasDetails=definitions&random=true'    
            }
            else {
                switch(partOfSpeechIndex) {

                    case 1:
                        customUrl += '?partOfSpeech=verb&'
                        break
    
                    case 2:
                        customUrl += '?partOfSpeech=noun&'
                        break
                    case 3:
                        customUrl += '?partOfSpeech=adjective&'
                        break;

                    case 4:
                        customUrl += '?partOfSpeech=adverb&'
                        break;
                    
                    default:
                        customUrl += '?'
                        break
                }
    
                let startingLettersTextLower = startingLettersText.toLowerCase()
                let endingLettersTextLower = endingLettersText.toLowerCase()
    
                customUrl += 'letterPattern=^' + startingLettersTextLower + '.*' + endingLettersTextLower + '$&hasDetails=definitions&random=true'        
            }
        }
        else {

            switch(partOfSpeechIndex) {

                case 1:
                    customUrl += '?partOfSpeech=verb&'
                    break

                case 2:
                    customUrl += '?partOfSpeech=noun&'
                    break
                case 3:
                    customUrl += '?partOfSpeech=adjective&'
                    break;

                case 4:
                    customUrl += '?partOfSpeech=adverb&'
                    break;
                
                default:
                    customUrl += '?'
                    break
            }

            let startingLettersTextLower = startingLettersText.toLowerCase()
            customUrl += 'letterPattern=^' + startingLettersTextLower + '.*$&hasDetails=definitions&random=true'
        }
        
    }
    else if (endingLettersChecked && endingLettersText) {
        if(partialLettersChecked && partialLettersText) {

            switch(partOfSpeechIndex) {

                case 1:
                    customUrl += '?partOfSpeech=verb&'
                    break
    
                case 2:
                    customUrl += '?partOfSpeech=noun&'
                    break
                case 3:
                    customUrl += '?partOfSpeech=adjective&'
                    break;

                case 4:
                    customUrl += '?partOfSpeech=adverb&'
                    break;

                default:
                    customUrl += '?'
                    break
            }

            let endingLettersTextLower = endingLettersText.toLowerCase()
            let partialLettersTextLower = partialLettersText.toLowerCase()

            customUrl += 'letterPattern=^' + '.*' + partialLettersTextLower + '.*' + endingLettersTextLower + '$&hasDetails=definitions&random=true'    

        }
        else {
            switch(partOfSpeechIndex) {

                case 1:
                    customUrl += '?partOfSpeech=verb&'
                    break
    
                case 2:
                    customUrl += '?partOfSpeech=noun&'
                    break
                case 3:
                    customUrl += '?partOfSpeech=adjective&'
                    break;
                
                default:
                    customUrl += '?'
                    break
            }
    
            let endingLettersTextLower = endingLettersText.toLowerCase()
            customUrl += 'letterPattern=^.*' + endingLettersTextLower + '$&hasDetails=definitions&random=true'    
        }
    }
    else if(partialLettersChecked && partialLettersText) {

        switch(partOfSpeechIndex) {

            case 1:
                customUrl += '?partOfSpeech=verb&'
                break

            case 2:
                customUrl += '?partOfSpeech=noun&'
                break
            case 3:
                customUrl += '?partOfSpeech=adjective&'
                break;

            case 4:
                customUrl += '?partOfSpeech=adverb&'
                break;
            
            default:
                customUrl += '?'
                break
        }
        let partialLettersTextLower = partialLettersText.toLowerCase()

        customUrl += 'letterPattern=^' + '.*' + partialLettersTextLower + '.*' + '$&hasDetails=definitions&random=true'
    }
    else{
        switch(partOfSpeechIndex) {

            case 0:
                customUrl += '?hasDetails=definitions&random=true'
                break

            case 1:
                customUrl += '?partOfSpeech=verb&hasDetails=definitions&random=true'
                break

            case 2:
                customUrl += '?partOfSpeech=noun&hasDetails=definitions&random=true'
                break
            case 3:
                customUrl += '?partOfSpeech=adjective&hasDetails=definitions&random=true'
                break;

            case 4:
                customUrl += '?partOfSpeech=adverb&hasDetails=definitions&random=true'
                break;
            
            default:
                customUrl += '?hasDetails=definitions&random=true'
                break
        }
    }
    if(onlyPronunciationWordChecked) customUrl += '&pronunciationPattern=\\w'    

    return customUrl
  }

  function getNumberOfLettersHint(wordLength) {
      let halfLength = Math.floor(wordLength/2)
      let numberOfLettersToFind = wordLength - halfLength

      if(halfLength === numberOfLettersToFind) return getPreviousEvenNumber(halfLength)
      else if (halfLength < numberOfLettersToFind) return (halfLength%2 === 0 ? halfLength : getPreviousEvenNumber(halfLength))
  }

  function getPreviousEvenNumber(number) {
      if(number%2 === 0) return (number-2)
      else return (number-1)
  }

  function sortAlphabetical(listOfWords) {
    return _.orderBy(listOfWords, 'word', 'asc')
  }

  function sortAlphabeticalReverse(listOfWords) {
      return _.orderBy(listOfWords, 'word', 'desc')
  }

  function sortLength(listOfWords) {
      return _.orderBy(listOfWords, 'word.length', 'asc')
  }

  function sortLengthDescending(listOfWords) {
      return _.orderBy(listOfWords, 'word.length', 'desc')
  }