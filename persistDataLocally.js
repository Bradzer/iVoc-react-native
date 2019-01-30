import AppConstants from './Constants'
import { 
    UPDATE_INDEX, 
    UPDATE_STARTING_LETTERS_CHKBOX, 
    UPDATE_ENDING_LETTERS_CHKBOX, 
    UPDATE_SPECIFIC_WORD_CHKBOX,
    UPDATE_STARTING_LETTERS_TEXT, 
    UPDATE_ENDING_LETTERS_TEXT, 
    UPDATE_SPECIFIC_WORD_TEXT,
    UPDATE_API_URL,
    UPDATE_SETTINGS_PREFERENCES,
    UPDATE_PARTIAL_LETTERS_TEXT,
    UPDATE_PARTIAL_WORD_CHKBOX, } from './actions'
    
const Realm = require('realm');

const _ = require('lodash')

const persistDataLocally = store => next => action => {

    let commonUrlpart = 'https://wordsapiv1.p.mashape.com/words/'

    switch(action.type) {
        
        case UPDATE_INDEX:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    realm.objects('settingsScreen').filtered('pk = 0').update('updatedIndex', action.data)

                    let settingsScreen = realm.objects('settingsScreen')
                    let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))
                    
                    realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
                })
            })
            .catch((error) => console.log(error))
            break;

        case UPDATE_STARTING_LETTERS_CHKBOX:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    realm.objects('settingsScreen').filtered('pk = 0').update('startingLettersChecked', !(action.data))

                    let settingsScreen = realm.objects('settingsScreen')
                    let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))

                    realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
                })
            })
            .catch((error) => console.log(error))
            break;

        case UPDATE_ENDING_LETTERS_CHKBOX:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    realm.objects('settingsScreen').filtered('pk = 0').update('endingLettersChecked', !(action.data))

                    let settingsScreen = realm.objects('settingsScreen')
                    let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))

                    realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
                })
            })
            .catch((error) => console.log(error))
            break;
        
        case UPDATE_PARTIAL_WORD_CHKBOX:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    realm.objects('settingsScreen').filtered('pk = 0').update('partialLettersChecked', !(action.data))

                    let settingsScreen = realm.objects('settingsScreen')
                    let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))

                    realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
                })
            })
            .catch((error) => console.log(error))
            break;

        case UPDATE_SPECIFIC_WORD_CHKBOX:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    realm.objects('settingsScreen').filtered('pk = 0').update('specificWordChecked', (!(action.data)))
                    let settingsScreen = realm.objects('settingsScreen')
                    let specificWordText = ((_.valuesIn(settingsScreen))[0].specificWordText).toLowerCase()

                    if(!(action.data) && specificWordText) {
                        realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + specificWordText)
                    }
                    else {
                        realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', AppConstants.RANDOM_URL)
                    }
                })
            })
            .catch((error) => console.log(error))
            break;

        case UPDATE_STARTING_LETTERS_TEXT:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    realm.objects('settingsScreen').filtered('pk = 0').update('startingLettersText', action.data)

                    let settingsScreen = realm.objects('settingsScreen')
                    let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))

                    realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
                })
            })
            .catch((error) => console.log(error))
            break;

        case UPDATE_ENDING_LETTERS_TEXT:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    realm.objects('settingsScreen').filtered('pk = 0').update('endingLettersText', action.data)

                    let settingsScreen = realm.objects('settingsScreen')
                    let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))
                    
                    realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
                })
            })
            .catch((error) => console.log(error))
            break;

        case UPDATE_PARTIAL_LETTERS_TEXT:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    realm.objects('settingsScreen').filtered('pk = 0').update('partialLettersText', action.data)

                    let settingsScreen = realm.objects('settingsScreen')
                    let customUrl = getCustomUrlPart(getPreferencesData(settingsScreen))
                    
                    realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + customUrl)
                })
            })
            .catch((error) => console.log(error))
            break;

        case UPDATE_SPECIFIC_WORD_TEXT:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    realm.objects('settingsScreen').filtered('pk = 0').update('specificWordText', action.data)
                    realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', commonUrlpart + action.data)
                })
            })
            .catch((error) => console.log(error))
            break;

        case UPDATE_API_URL:
            break
                
        case UPDATE_SETTINGS_PREFERENCES:
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    realm.objects('settingsScreen').filtered('pk = 0').update('updatedIndex', action.data.updatedIndex)
                    realm.objects('settingsScreen').filtered('pk = 0').update('startingLettersChecked', action.data.startingLettersChecked)
                    realm.objects('settingsScreen').filtered('pk = 0').update('endingLettersChecked', action.data.endingLettersChecked)
                    realm.objects('settingsScreen').filtered('pk = 0').update('partialLettersChecked', action.data.partialLettersChecked)
                    realm.objects('settingsScreen').filtered('pk = 0').update('specificWordChecked', action.data.specificWordChecked)
                    realm.objects('settingsScreen').filtered('pk = 0').update('startingLettersText', action.data.startingLettersText)
                    realm.objects('settingsScreen').filtered('pk = 0').update('endingLettersText', action.data.endingLettersText)
                    realm.objects('settingsScreen').filtered('pk = 0').update('partialLettersText', action.data.partialLettersText)
                    realm.objects('settingsScreen').filtered('pk = 0').update('specificWordText', action.data.specificWordText)
                    realm.objects('settingsScreen').filtered('pk = 0').update('apiUrl', action.data.apiUrl)
                })
            })
            .catch((error) => console.log(error))
            break;

        default:
            break;
    }
    next(action)
}
  
  export default persistDataLocally;

  function getPreferencesData(settingsScreen) {

    let updatedIndex = (_.valuesIn(settingsScreen))[0].updatedIndex
    let startingLettersChecked = (_.valuesIn(settingsScreen))[0].startingLettersChecked
    let endingLettersChecked = (_.valuesIn(settingsScreen))[0].endingLettersChecked
    let partialLettersChecked = (_.valuesIn(settingsScreen))[0].partialLettersChecked
    let startingLettersText = (_.valuesIn(settingsScreen))[0].startingLettersText
    let endingLettersText = (_.valuesIn(settingsScreen))[0].endingLettersText
    let partialLettersText = (_.valuesIn(settingsScreen))[0].partialLettersText
    let preferencesData = {
        updatedIndex,
        startingLettersChecked,
        endingLettersChecked,
        partialLettersChecked,
        startingLettersText,
        endingLettersText,
        partialLettersText,
    }
    return preferencesData
  }

  function getCustomUrlPart(preferencesData) {

    let customUrl = ''
    const { startingLettersChecked, endingLettersChecked, partialLettersChecked, updatedIndex, startingLettersText, endingLettersText, partialLettersText } = preferencesData
    
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
            
            default:
            customUrl += '?hasDetails=definitions&random=true'
                break
        }
    }    
    return customUrl
  }