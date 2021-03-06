import { applyMiddleware } from 'redux'
import Reactotron from './ReactotronConfig'
import persistDataLocally from './persistDataLocally'

import { 
    ADD_RESPONSE_DATA, 
    RESET_RESPONSE_DATA, 
    UPDATE_INDEX, UPDATE_STARTING_LETTERS_CHKBOX, 
    UPDATE_ENDING_LETTERS_CHKBOX, 
    UPDATE_SPECIFIC_WORD_CHKBOX, 
    UPDATE_STARTING_LETTERS_TEXT, 
    UPDATE_ENDING_LETTERS_TEXT, 
    UPDATE_SPECIFIC_WORD_TEXT, 
    UPDATE_API_URL, 
    UPDATE_SETTINGS_PREFERENCES, 
    DISPLAY_CHANGE_PREFS_BTN, 
    DISPLAY_VOCABULARY_OVERLAY, 
    HIDE_VOCABULARY_OVERLAY, 
    UPDATE_LIST_OF_WORDS,
    DELETE_WORD_IN_LIST,
    UPDATE_SEARCH_VALUE,
    UPDATE_SEARCH_RESULTS,
    UPDATE_REVIEW_CONTENT, 
    SHOW_NO_VOCABULARY,
    RESET_REVIEW_LAYOUT, 
    SHOW_REVIEW_OVER,
    HIDE_REVIEW_OVERLAY,
    DISPLAY_REVIEW_OVERLAY,
    UPDATE_PARTIAL_WORD_CHKBOX, 
    UPDATE_PARTIAL_LETTERS_TEXT, 
    SHOW_LOADING_INDICATOR, 
    HIDE_LOADING_INDICATOR,
    UPDATE_REVIEW_ANSWER_TEXT_VALUE,
    UPDATE_PRONUNCIATION_WORD_CHKBOX, } from './actions'

const initialState = {
    itemDef: [],
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
    vocabularyDefinition: [],
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
    reviewOverlayDisplay: false,
    reviewPronunciation: '',
    reviewFrequency: '',
    reviewDefinition: [],
    reviewOriginalId: '',
    partialLettersChecked: false,
    partialLettersText: '',
    displayLoadingIndicator: true,
    reviewStartingLetter: '',
    reviewEndingLetter: '',
    currentRewiewDefinition: '',
    reviewAnswerText: '',
    showNoVocabulary: false,
    showReviewOver: false,
    onlyPronunciationWordChecked: false,
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
                itemDef: [],
                displayRandomWord: 'none',
                displayButtons: 'none',
                displayWordDefinition: 'none',
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

            case UPDATE_PRONUNCIATION_WORD_CHKBOX:
                return updateState(state, {
                    onlyPronunciationWordChecked: !(action.data)
                })

            case UPDATE_SPECIFIC_WORD_CHKBOX:
                return updateState(state, {
                    specificWordChecked: !(action.data),
                    randomWordPrefDisplay: ((action.data) ? 'flex' : 'none')
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
                    onlyPronunciationWordChecked: action.data.onlyPronunciationWordChecked,
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

            case UPDATE_REVIEW_CONTENT:
                return updateState(state, {
                    reviewStartingLetter: action.data.wordObject.word.charAt(0),
                    reviewEndingLetter: action.data.wordObject.word.charAt(action.data.wordObject.word.length - 1),
                    currentRewiewDefinition: action.data.wordObject.definition[action.data.randomDefIndex].definition,
                    reviewWord: action.data.wordObject.word,
                    reviewPronunciation: action.data.wordObject.pronunciation,
                    reviewFrequency: action.data.wordObject.frequency,
                    reviewDefinition: action.data.wordObject.definition,
                    displayLoadingIndicator: false,
                    displayReviewContent: 'flex',
                })

            case SHOW_NO_VOCABULARY:
                return updateState(state, {
                    showNoVocabulary: true,
                    displayLoadingIndicator: false,
                })

            case RESET_REVIEW_LAYOUT:
                return updateState(state, {
                    reviewDefinition: [],
                    reviewStartingLetter: '',
                    reviewEndingLetter: '',
                    currentRewiewDefinition: '',
                    reviewAnswerText: '',
                    showNoVocabulary: false,
                    showReviewOver: false,
                    displayReviewContent: 'none',
                })

            case SHOW_REVIEW_OVER: 
                return updateState(state, {
                    showReviewOver: true,
                })

            case HIDE_REVIEW_OVERLAY:
                return updateState(state, {
                    reviewOverlayDisplay: false
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

            case UPDATE_REVIEW_ANSWER_TEXT_VALUE:
                return updateState(state, {
                    reviewAnswerText: action.data
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