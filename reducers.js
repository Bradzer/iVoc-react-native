import { createStore, applyMiddleware } from 'redux'
import persistDataLocally from './persistDataLocally'

import { CHANGE_TITLE, CHANGE_SUBTITLE, CHANGE_KEY, CHANGE_LIST_ITEM, ADD_RESPONSE_DATA, RESET_RESPONSE_DATA, DISPLAY_WORD_DEFINITION, UPDATE_INDEX, UPDATE_STARTING_LETTERS_CHKBOX, UPDATE_ENDING_LETTERS_CHKBOX, UPDATE_REALM, UPDATE_STARTING_LETTERS_TEXT, UPDATE_ENDING_LETTERS_TEXT, UPDATE_API_URL, UPDATE_SETTINGS_PREFENRENCES, DISPLAY_CHANGE_PREFS_BTN } from './actions'

const initialState = {
    itemDef: '',
    itemSynonyms: '',
    itemExamples: '',
    itemWord: '',
    itemPartOfSpeech: '',
    itemPronunciation: '',
    itemFrequency: '',
    displayRandomWord: 'none',
    displayButtons: 'none',
    displayScrollView: 'none',
    displayWordDefinition: 'none',
    buttonRightIconName: 'x-circle',
    buttonRightIconType: 'foundation',
    buttonRightTitle: "I don't know this",
    buttonLeftIconName: 'checkbox-marked-circle',
    buttonLeftIconType:'material-community',
    buttonLeftTitle:"I know this",
    displayChangePrefsBtn: 'none',
    selectedIndex: 0,
    startingLettersChecked: false,
    endingLettersChecked: false,
    realm: null,
    startingLettersText: '',
    endingLettersText: '',
    apiUrl: '',
}

const reducer = (state = initialState, action) => {
    switch(action.type) {

        case CHANGE_TITLE:
            return (Object.assign({}, state, {
                itemTitle: action.title
            }))

        case CHANGE_SUBTITLE:
            return (Object.assign({}, state, {
                itemSubtitle: action.subtitle
            }))

        case CHANGE_KEY:
            return (Object.assign({}, state, {
                itemKey: action.key
            }))

        case CHANGE_LIST_ITEM:
            return (Object.assign({}, state, {
                itemKey: (action.itemData)[0],
                itemTitle: (action.itemData)[1],
                itemSubtitle: (action.itemData)[2]
            }))

        case ADD_RESPONSE_DATA:
            return(Object.assign({}, state, {
                itemWord: action.data.word,
                itemPartOfSpeech: action.data.partOfSpeech,
                itemPronunciation: action.data.pronunciation,
                itemFrequency: action.data.frequency,
                itemDef: action.data.definition,
                displayRandomWord: 'flex',
                displayButtons: 'flex',
                buttonRightIconName: 'x-circle',
                buttonRightIconType: 'foundation',
                buttonRightTitle: "I don't know this",
                buttonLeftIconName: 'checkbox-marked-circle',
                buttonLeftIconType:'material-community',
                buttonLeftTitle:"I know this",            
                displayWordDefinition: 'none',
                displayScrollView: 'flex',
                displayChangePrefsBtn: 'none'
            }))

        case RESET_RESPONSE_DATA:
            return(Object.assign({}, state, {
                itemWord: '',
                itemPartOfSpeech: '',
                itemPronuncitation: '',
                itemFrequency: '',
                itemDef: '',
                displayRandomWord: 'none',
                displayButtons: 'none',
                displayWordDefinition: 'none',
                buttonRightIconName: 'x-circle',
                buttonRightIconType: 'foundation',
                buttonRightTitle: "I don't know this",

            }))

            case DISPLAY_WORD_DEFINITION:
                return(Object.assign({}, state, {
                    displayWordDefinition: 'flex',
                    buttonRightIconName: 'checkbox-marked-circle',
                    buttonRightIconType: 'material-community',
                    buttonRightTitle: 'Got it',
                    buttonLeftIconName: 'x-circle',
                    buttonLeftIconType:'foundation',
                    buttonLeftTitle:"Not interested",
                
                }))

            case UPDATE_INDEX:
                return(Object.assign({}, state, {
                    selectedIndex: action.data
                }))

            case UPDATE_STARTING_LETTERS_CHKBOX:
                return(Object.assign({}, state, {
                    startingLettersChecked: !(action.data)
                }))

            case UPDATE_ENDING_LETTERS_CHKBOX:
                return(Object.assign({}, state, {
                    endingLettersChecked: !(action.data)
                }))

            case UPDATE_REALM: 
                return(Object.assign({}, state, {
                    realm: action.data
                }))

            case UPDATE_STARTING_LETTERS_TEXT:
                return(Object.assign({}, state, {
                    startingLettersText: action.data
                }))

            case UPDATE_ENDING_LETTERS_TEXT:
                return(Object.assign({}, state, {
                    endingLettersText: action.data
                }))

            case UPDATE_API_URL:
                return(Object.assign({}, state, {
                    apiUrl: action.data
                }))

            case UPDATE_SETTINGS_PREFENRENCES:
                return(Object.assign({}, state, {
                    selectedIndex: action.data.partOfSpeechIndex,
                    startingLettersChecked: action.data.startingLettersCheckBoxStatus,
                    endingLettersChecked: action.data.endingLettersCheckBoxStatus,
                    startingLettersText: action.data.startingLettersText,
                    endingLettersText: action.data.endingLettersText,
                    apiUrl: action.data.apiUrl              
                }))

            case DISPLAY_CHANGE_PREFS_BTN:
                return (Object.assign({}, state, {
                    displayChangePrefsBtn: 'flex',
                    displayButtons: 'none',
                    displayScrollView: 'none',
                
                }))

        default:
            return state
    }
}

const store = createStore(reducer, applyMiddleware(persistDataLocally))

export default store

