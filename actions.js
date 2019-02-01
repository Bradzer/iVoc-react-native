export const ADD_RESPONSE_DATA = 'ADD_RESPONSE_DATA'
export const RESET_RESPONSE_DATA = 'RESET_RESPONSE_DATA'
export const UPDATE_INDEX = 'UPDATE_INDEX'
export const UPDATE_STARTING_LETTERS_CHKBOX = 'UPDATE_STARTING_LETTERS_CHKBOX'
export const UPDATE_ENDING_LETTERS_CHKBOX = 'UPDATE_ENDING_LETTERS_CHKBOX'
export const UPDATE_SPECIFIC_WORD_CHKBOX = 'UPDATE_SPECIFIC_WORD_CHKBOX'
export const UPDATE_SETTINGS_PREFERENCES = 'UPDATE_SETTINGS_PREFERENCES'
export const UPDATE_STARTING_LETTERS_TEXT = 'UPDATE_STARTING_LETTERS_TEXT'
export const UPDATE_ENDING_LETTERS_TEXT = 'UPDATE_ENDING_LETTERS_TEXT'
export const UPDATE_SPECIFIC_WORD_TEXT = 'UPDATE_SPECIFIC_WORD_TEXT'
export const UPDATE_API_URL = 'UPDATE_API_URL'
export const DISPLAY_CHANGE_PREFS_BTN = 'DISPLAY_CHANGE_PREFS_BTN'
export const DISPLAY_VOCABULARY_OVERLAY = 'DISPLAY_VOCABULARY_OVERLAY'
export const HIDE_VOCABULARY_OVERLAY = 'HIDE_VOCABULARY_OVERLAY'
export const UPDATE_LIST_OF_WORDS = 'UPDATE_LIST_OF_WORDS'
export const DELETE_WORD_IN_LIST = 'DELETE_WORD_IN_LIST'
export const UPDATE_SEARCH_VALUE = 'UPDATE_SEARCH_VALUE'
export const UPDATE_SEARCH_RESULTS = 'UPDATE_SEARCH_RESULTS'
export const UPDATE_REVIEW_CONTENT = 'UPDATE_REVIEW_CONTENT'
export const SHOW_NO_VOCABULARY = 'SHOW_NO_VOCABULARY'
export const RESET_REVIEW_LAYOUT = 'RESET_REVIEW_LAYOUT'
export const SHOW_REVIEW_OVER = 'SHOW_REVIEW_OVER'
export const HIDE_REVIEW_OVERLAY = 'HIDE_REVIEW_OVERLAY'
export const DISPLAY_REVIEW_OVERLAY = 'DISPLAY_REVIEW_OVERLAY'
export const UPDATE_PARTIAL_WORD_CHKBOX = 'UPDATE_PARTIAL_WORD_CHKBOX'
export const UPDATE_PARTIAL_LETTERS_TEXT = 'UPDATE_PARTIAL_LETTERS_TEXT'
export const SHOW_LOADING_INDICATOR = 'SHOW_LOADING_INDICATOR'
export const HIDE_LOADING_INDICATOR = 'HIDE_LOADING_INDICATOR'
export const UPDATE_REVIEW_ANSWER_TEXT_VALUE = 'UPDATE_REVIEW_ANSWER_TEXT_VALUE'
export const UPDATE_PRONUNCIATION_WORD_CHKBOX = 'UPDATE_PRONUNCIATION_WORD_CHKBOX'

export function addResponseData(data) {
    return {
        type: ADD_RESPONSE_DATA,
        data: data    
    }
}

export function resetResponseData() {
    return {
        type: RESET_RESPONSE_DATA
    }
}

export function updateIndex(selectedIndex){
    return {
        type: UPDATE_INDEX,
        data: selectedIndex
    }
}

export function updateStartingLettersCheckBox(currentStatus) {
    return {
        type: UPDATE_STARTING_LETTERS_CHKBOX,
        data: currentStatus
    }
}

export function updateEndingLettersCheckBox(currentStatus) {
    return {
        type: UPDATE_ENDING_LETTERS_CHKBOX,
        data: currentStatus
    }
}

export function updateSpecificWordCheckBox(currentStatus) {
    return {
        type: UPDATE_SPECIFIC_WORD_CHKBOX,
        data: currentStatus
    }
}

export function updatePronunciationCheckbox(currentStatus) {
    return {
        type: UPDATE_PRONUNCIATION_WORD_CHKBOX,
        data: currentStatus
    }
}

export function updatePartialWordCheckbox(currentStatus) {
    return {
        type: UPDATE_PARTIAL_WORD_CHKBOX,
        data: currentStatus
    }
}

export function updateStartingLettersText(changedText) {
    return {
        type: UPDATE_STARTING_LETTERS_TEXT,
        data: changedText
    }
}

export function updateEndingLettersText(changedText) {
    return {
        type: UPDATE_ENDING_LETTERS_TEXT,
        data: changedText
    }
}

export function updatePartialLettersText(changedText) {
    return {
        type: UPDATE_PARTIAL_LETTERS_TEXT,
        data: changedText
    }
}

export function updateSpecificWordText(changedText) {
    return {
        type: UPDATE_SPECIFIC_WORD_TEXT,
        data: changedText
    }
}

export function updateApiUrl(url) {
    return {
        type: UPDATE_API_URL,
        data: url
    }
}

export function displayUpdateChangePrefsBtn() {
    return {
        type: DISPLAY_CHANGE_PREFS_BTN,
    }

}

export function updateSettingsPreferences(settingsPreferencesRealmData) {
    return {
        type: UPDATE_SETTINGS_PREFERENCES,
        data: settingsPreferencesRealmData
    }
}

export function displayVocabularyOverlay(wordDetails){
    return {
        type: DISPLAY_VOCABULARY_OVERLAY,
        data: wordDetails
    }
}

export function hideVocabularyOverlay() {
    return {
        type: HIDE_VOCABULARY_OVERLAY
    }
}

export function updateListOfWords(listOfWords) {
    return {
        type: UPDATE_LIST_OF_WORDS,
        data: listOfWords
    }
}

export function deleteWordInList(index) {
    return {
        type: DELETE_WORD_IN_LIST,
        data: index
    }
}

export function updateSearchValue(changedText) {
    return {
        type: UPDATE_SEARCH_VALUE,
        data: changedText
    }
}

export function updateSearchResults(changedText) {
    return {
        type: UPDATE_SEARCH_RESULTS,
        data: changedText
    }
}

export function updateReviewContent(wordObject, randomDefIndex) {
    return {
        type: UPDATE_REVIEW_CONTENT,
        data: { 
            wordObject,
            randomDefIndex
        }
    }
}

export function showNoVocabulary() {
    return {
        type: SHOW_NO_VOCABULARY,
    }
}

export function resetReviewLayout() {
    return {
        type: RESET_REVIEW_LAYOUT,
    }
}

export function showReviewOver() {
    return {
        type: SHOW_REVIEW_OVER,
    }
}

export function hideReviewOverlay() {
    return {
        type: HIDE_REVIEW_OVERLAY
    }
}

export function displayReviewOverlay() {
    return {
        type: DISPLAY_REVIEW_OVERLAY,
    }
}

export function showLoadingIndicator() {
    return {
        type: SHOW_LOADING_INDICATOR
    }
}

export function hideLoadingIndicator() {
    return {
        type: HIDE_LOADING_INDICATOR
    }
}

export function updateReviewAnswerTextValue(changedText) {
    return {
        type: UPDATE_REVIEW_ANSWER_TEXT_VALUE,
        data: changedText
    }
}