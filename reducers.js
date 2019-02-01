import { applyMiddleware } from 'redux'
import Reactotron from './ReactotronConfig'
import persistDataLocally from './persistDataLocally'

import { 
    ADD_RESPONSE_DATA, 
    RESET_RESPONSE_DATA, 
    DISPLAY_WORD_DEFINITION, 
    UPDATE_INDEX, UPDATE_STARTING_LETTERS_CHKBOX, 
    UPDATE_ENDING_LETTERS_CHKBOX, 
    UPDATE_SPECIFIC_WORD_CHKBOX, 
    UPDATE_REALM, 
    UPDATE_STARTING_LETTERS_TEXT, 
    UPDATE_ENDING_LETTERS_TEXT, 
    UPDATE_SPECIFIC_WORD_TEXT, 
    UPDATE_API_URL, 
    UPDATE_SETTINGS_PREFERENCES, 
    DISPLAY_CHANGE_PREFS_BTN, 
    DISPLAY_VOCABULARY_OVERLAY, 
    HIDE_VOCABULARY_OVERLAY, 
    UPDATE_LIST_OF_WORDS,
    UPDATE_VOCABULARY_WORD, 
    UPDATE_VOCABULARY_PART_OF_SPEECH, 
    UPDATE_VOCABULARY_DEFINITION, 
    UPDATE_VOCABULARY_PRONUNCIATION, 
    UPDATE_VOCABULARY_FREQUENCY, 
    CLEAR_LIST_OF_WORDS,
    DELETE_WORD_IN_LIST,
    UPDATE_SEARCH_VALUE,
    UPDATE_SEARCH_RESULTS,
    UPDATE_REVIEW_CONTENT, 
    SHOW_NO_VOCABULARY,
    RESET_REVIEW_LAYOUT, 
    SHOW_REVIEW_OVER,
    HIDE_REVIEW_OVERLAY,
    DISPLAY_REVIEW_OVERLAY_WITH_DATA,
    DISPLAY_REVIEW_OVERLAY,
    UPDATE_REVIEW_BUTTONS,
    UPDATE_PARTIAL_WORD_CHKBOX, 
    UPDATE_PARTIAL_LETTERS_TEXT, 
    SHOW_LOADING_INDICATOR, 
    HIDE_LOADING_INDICATOR, } from './actions'

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
    buttonRightIconName: 'controller-next',
    buttonRightIconType: 'entypo',
    buttonRightTitle: "Skip",
    buttonLeftIconName: 'add-to-list',
    buttonLeftIconType:'entypo',
    buttonLeftTitle:"Add to vocabulary",
    displayChangePrefsBtn: 'none',
    selectedIndex: 0,
    startingLettersChecked: false,
    endingLettersChecked: false,
    realm: null,
    startingLettersText: '',
    endingLettersText: '',
    apiUrl: '',
    vocabularyOverlayDisplay: false,
    vocabularyWord: '',
    vocabularyPartOfSpeech: '',
    vocabularyDefinition: '',
    vocabularyPronunciation: '',
    vocabularyFrequency: '',
    specificWordChecked: false,
    specificWordText: '',
    randomWordPrefDisplay: 'flex',
    listOfWords: [],
    searchBarValue: '',
    reviewIntroTextDisplay: 'none',
    displayReviewContent: 'none',
    reviewWord: '',
    reviewLeftBtnTitle: 'No',
    reviewLeftBtnIconName: 'times-circle',
    reviewLeftBtnIconType: 'font-awesome',
    reviewRightBtnTitle: 'Yes',
    reviewRightBtnIconName: 'check-circle',
    reviewRightBtnIconType: 'font-awesome', 
    reviewIntroText: 'Do your remember this...',
    reviewOverlayDisplay: false,
    reviewPronunciation: '',
    reviewFrequency: '',
    reviewDefinition: '',
    reviewOriginalId: '',
    partialLettersChecked: false,
    partialLettersText: '',
    displayLoadingIndicator: true,
}

const reducer = (state = initialState, action) => {
    switch(action.type) {

        case ADD_RESPONSE_DATA:
            return updateState(state, {
                itemWord: action.data.word,
                itemPartOfSpeech: action.data.partOfSpeech,
                itemPronunciation: action.data.pronunciation,
                itemFrequency: action.data.frequency,
                itemDef: action.data.definition,
                displayRandomWord: 'flex',
                displayButtons: 'flex',
                displayWordDefinition: 'none',
                displayScrollView: 'flex',
                displayChangePrefsBtn: 'none',
                displayLoadingIndicator: false,
            })

        case RESET_RESPONSE_DATA:
            return updateState(state, {
                itemWord: '',
                itemPartOfSpeech: '',
                itemPronuncitation: '',
                itemFrequency: '',
                itemDef: '',
                displayRandomWord: 'none',
                displayButtons: 'none',
                displayWordDefinition: 'none',
            })

            case DISPLAY_WORD_DEFINITION:
                return updateState(state, {
                    displayWordDefinition: 'flex',
                })

            case UPDATE_INDEX:
                return updateState(state, {
                    selectedIndex: action.data
                })

            case UPDATE_STARTING_LETTERS_CHKBOX:
                return updateState(state, {
                    startingLettersChecked: !(action.data),
                    specificWordChecked: false
                })

            case UPDATE_ENDING_LETTERS_CHKBOX:
                return updateState(state, {
                    endingLettersChecked: !(action.data),
                    specificWordChecked: false
                })

            case UPDATE_PARTIAL_WORD_CHKBOX:
            return updateState(state, {
                partialLettersChecked: !(action.data),
                specificWordChecked: false
            })

            case UPDATE_SPECIFIC_WORD_CHKBOX:
                return updateState(state, {
                    specificWordChecked: !(action.data),
                    randomWordPrefDisplay: ((action.data) ? 'flex' : 'none')
                })

            case UPDATE_REALM: 
                return updateState(state, {
                    realm: action.data
                })

            case UPDATE_STARTING_LETTERS_TEXT:
                return updateState(state, {
                    startingLettersText: action.data
                })

            case UPDATE_ENDING_LETTERS_TEXT:
                return updateState(state, {
                    endingLettersText: action.data
                })

            case UPDATE_PARTIAL_LETTERS_TEXT:
                return updateState(state, {
                    partialLettersText: action.data
                })

            case UPDATE_SPECIFIC_WORD_TEXT:
                return updateState(state, {
                    specificWordText: action.data
                })

            case UPDATE_API_URL:
                return updateState(state, {
                    apiUrl: action.data
                })

            case UPDATE_SETTINGS_PREFERENCES:
                return updateState(state, {
                    selectedIndex: action.data.updatedIndex,
                    startingLettersChecked: action.data.startingLettersChecked,
                    endingLettersChecked: action.data.endingLettersChecked,
                    partialLettersChecked: action.data.partialLettersChecked,
                    startingLettersText: action.data.startingLettersText,
                    endingLettersText: action.data.endingLettersText,
                    partialLettersText: action.data.partialLettersText,
                    apiUrl: action.data.apiUrl,
                    specificWordChecked: action.data.specificWordChecked,
                    specificWordText: action.data.specificWordText,
                    randomWordPrefDisplay: action.data.specificWordChecked ? 'none' : 'flex'
                              
                })

            case DISPLAY_CHANGE_PREFS_BTN:
                return updateState(state, {
                    displayChangePrefsBtn: 'flex',
                    displayButtons: 'none',
                    displayScrollView: 'none',
                    displayLoadingIndicator: false,
                })

            case CLEAR_LIST_OF_WORDS:
                return updateState(state, {
                    listOfWords: []
                })

            case DISPLAY_VOCABULARY_OVERLAY:
                return updateState(state, {
                    vocabularyOverlayDisplay: true,
                    vocabularyWord: action.data.word,
                    vocabularyPartOfSpeech: action.data.partOfSpeech,
                    vocabularyDefinition: action.data.definition,
                    vocabularyPronunciation: action.data.pronunciation,
                    vocabularyFrequency: action.data.frequency,
                
                })

            case HIDE_VOCABULARY_OVERLAY:
                return updateState(state, {
                    vocabularyOverlayDisplay: false,                
                })

            case UPDATE_LIST_OF_WORDS:
                return updateState(state, {
                    listOfWords: action.data,
                    displayLoadingIndicator: false,
                })

            case UPDATE_SEARCH_VALUE:
                return updateState(state, {
                    searchBarValue: action.data
                })

            case UPDATE_SEARCH_RESULTS:
                return updateState(state, {
                    listOfWords: state.listOfWords.filter((value) => value.word.includes(action.data)),
                })

            case DELETE_WORD_IN_LIST:
                return updateState(state, {
                    listOfWords: state.listOfWords.filter((value, index) => index !== action.data)
                })

            case UPDATE_VOCABULARY_WORD:
                return updateState(state, {
                    vocabularyWord: action.data
                })

            case UPDATE_VOCABULARY_PART_OF_SPEECH:
                return updateState(state, {
                    vocabularyPartOfSpeech: action.data
                })

            case UPDATE_VOCABULARY_DEFINITION:
                return updateState(state, {
                    vocabularyDefinition: action.data
                })

            case UPDATE_VOCABULARY_PRONUNCIATION:
                return updateState(state, {
                    vocabularyPronunciation: action.data
                })

            case UPDATE_VOCABULARY_FREQUENCY:
                return updateState(state, {
                    vocabularyFrequency: action.data
                })

            case UPDATE_REVIEW_CONTENT:
                return updateState(state, {
                    reviewWord: action.data,
                    displayReviewContent: 'flex',
                    reviewIntroTextDisplay: 'flex',
                    displayLoadingIndicator: false,
                })

            case SHOW_NO_VOCABULARY:
                return updateState(state, {
                    reviewIntroText: 'Your vocabulary is empty',
                    reviewIntroTextDisplay: 'flex',
                    displayLoadingIndicator: false,
                })

            case RESET_REVIEW_LAYOUT:
                return updateState(state, {
                    reviewLeftBtnTitle: 'No',
                    reviewLeftBtnIconName: 'times-circle',
                    reviewLeftBtnIconType: 'font-awesome',
                    reviewRightBtnTitle: 'Yes',
                    reviewRightBtnIconName: 'check-circle',
                    reviewRightBtnIconType: 'font-awesome', 
                    reviewIntroText: 'Do your remember this...',
                    reviewIntroTextDisplay: 'none',
                    displayReviewContent: 'none',
                    reviewOverlayDisplay: false
                })

            case SHOW_REVIEW_OVER: 
                return updateState(state, {
                    reviewIntroText: 'The review is over',
                    displayReviewContent: 'none',
                })

            case HIDE_REVIEW_OVERLAY:
                return updateState(state, {
                    reviewOverlayDisplay: false
                })

            case DISPLAY_REVIEW_OVERLAY_WITH_DATA:
                return updateState(state, {
                    reviewPronunciation: action.data.pronunciation,
                    reviewFrequency: action.data.frequency,
                    reviewDefinition: action.data.definition,                
                    reviewOverlayDisplay: true,
                    reviewRightBtnTitle: 'Next',
                    reviewRightBtnIconName: 'controller-next',
                    reviewRightBtnIconType: 'entypo',
                    reviewLeftBtnTitle: 'Show definitions',
                    reviewLeftBtnIconName: 'documents',
                    reviewLeftBtnIconType: 'entypo'
                })

            case UPDATE_REVIEW_BUTTONS:
                return updateState(state, {
                    reviewLeftBtnTitle: 'No',
                    reviewLeftBtnIconName: 'times-circle',
                    reviewLeftBtnIconType: 'font-awesome',
                    reviewRightBtnTitle: 'Yes',
                    reviewRightBtnIconName: 'check-circle',
                    reviewRightBtnIconType: 'font-awesome',                 
                })

            case DISPLAY_REVIEW_OVERLAY:
                return updateState(state, {
                    reviewOverlayDisplay: true
                })
            
            case SHOW_LOADING_INDICATOR:
                return updateState(state, {
                    displayLoadingIndicator: true
                })

                case HIDE_LOADING_INDICATOR:
                return updateState(state, {
                    displayLoadingIndicator: false
                })

        default:
            return state
    }
}

const store = Reactotron.createStore(reducer, applyMiddleware(persistDataLocally))

export default store

function updateState(state, updatedValues) {
    return (Object.assign({}, state, updatedValues))
}