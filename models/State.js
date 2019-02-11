import { decorate, observable, action } from "mobx"

import AppConstants from '../Constants'
import reactotron from "../ReactotronConfig";

const Realm = require('realm');

const _ = require('lodash');

const commonUrlpart = 'https://wordsapiv1.p.mashape.com/words/'

class State {

    //attributes
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
    selectedIndex= 0
    startingLettersChecked= false
    endingLettersChecked= false
    realm= null
    startingLettersText= ''
    endingLettersText= ''
    apiUrl= ''
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
    searchBarValue= ''
    reviewIntroTextDisplay= 'none'
    displayReviewContent= 'none'
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

    //actions
    updateApiUrl = action((apiUrl) => {
        this.apiUrl = apiUrl
    })

    resetResponseData = action(() => {
        this.itemWord= ''
        this.itemPartOfSpeech= ''
        this.itemPronuncitation= ''
        this.itemFrequency= ''
        this.practiceSpecificWordSearch=''
        this.itemDef= []
        this.displayRandomWord= 'none'
        this.displayButtons= 'none'
        this.displayWordDefinition= 'none'
    })

    showLoadingIndicator = action(() => {
        this.displayLoadingIndicator = true
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
        this.displayLoadingIndicator= false
    })

    displayUpdateChangePrefsBtn = action(() => {
        this.displayChangePrefsBtn= 'flex'
        this.displayButtons= 'none'
        this.displayScrollView= 'none'
        this.displayLoadingIndicator= false
    })

    showNoVocabulary = action(() => {
        this.isNoVocabulary= true
        this.displayLoadingIndicator= false
    })

    resetReviewLayout = action(() => {
        this.reviewDefinition= []
        this.reviewStartingLetter= ''
        this.reviewEndingLetter= ''
        this.currentRewiewDefinition= ''
        this.reviewAnswerText= ''
        this.isNoVocabulary= false
        this.showReviewOver= false
        this.displayReviewContent= 'none'
    })

    updateReviewContent = action((randomWord, randomDefIndex) => {
        this.reviewStartingLetter= randomWord.word.charAt(0)
        this.reviewEndingLetter= randomWord.word.charAt(randomWord.word.length - 1)
        this.currentRewiewDefinition= randomWord.definition[randomDefIndex].definition
        this.reviewWord= randomWord.word
        this.reviewPronunciation= randomWord.pronunciation
        this.reviewFrequency= randomWord.frequency
        this.reviewDefinition= randomWord.definition
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
                realm.objects('settingsScreen').filtered('pk = 0').update('updatedIndex', settingsPreferencesInRealm.updatedIndex)
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
        .catch((error) => console.log(error))

        this.selectedIndex= settingsPreferencesInRealm.updatedIndex
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

    updateIndex = action((selectedIndex) => {
        Realm.open({})
        .then((realm) => {
            realm.write(() => {
                realm.objects('settingsScreen').filtered('pk = 0').update('updatedIndex', selectedIndex)
    
                let settingsScreen = realm.objects('settingsScreen')
                let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))
                
                realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
            })
        })
        .catch((error) => console.log(error))
    
        this.selectedIndex= selectedIndex
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
        .catch((error) => console.log(error))

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
        .catch((error) => console.log(error))

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
        .catch((error) => console.log(error))

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
        .catch((error) => console.log(error))

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
        .catch((error) => console.log(error))

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
        .catch((error) => console.log(error))

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
        .catch((error) => console.log(error))

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
        .catch((error) => console.log(error))

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
        .catch((error) => console.log(error))

        this.specificWordText= changedText
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
        this.displayLoadingIndicator= false
    })

    updateSearchResults = action((changedText) => {
        this.listOfWords= this.listOfWords.filter((value) => value.word.includes(changedText))
    })
}

decorate(State, {
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
    selectedIndex: observable,
    startingLettersChecked: observable,
    endingLettersChecked: observable,
    realm: observable,
    startingLettersText: observable,
    endingLettersText: observable,
    apiUrl: observable,
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
})
const store = new State()

export default store

function getPreferencesData(settingsScreen) {

    let updatedIndex = (_.valuesIn(settingsScreen))[0].updatedIndex
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
        updatedIndex,
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
    const { startingLettersChecked, endingLettersChecked, partialLettersChecked, onlyPronunciationWordChecked, updatedIndex, startingLettersText, endingLettersText, partialLettersText } = preferencesData
    
    if(startingLettersChecked && startingLettersText ) {
        if (endingLettersChecked && endingLettersText) {
            if(partialLettersChecked && partialLettersText) {
                switch(updatedIndex) {

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
                switch(updatedIndex) {

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

            switch(updatedIndex) {

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

            switch(updatedIndex) {

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
            switch(updatedIndex) {

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

        switch(updatedIndex) {

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
        switch(updatedIndex) {

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