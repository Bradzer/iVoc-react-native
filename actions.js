export const ADD_RESPONSE_DATA = 'ADD_RESPONSE_DATA'
export const RESET_RESPONSE_DATA = 'RESET_RESPONSE_DATA'
export const DISPLAY_WORD_DEFINITION = 'DISPLAY_WORD_DEFINITION'
export const UPDATE_INDEX = 'UPDATE_INDEX'
export const UPDATE_STARTING_LETTERS_CHKBOX = 'UPDATE_STARTING_LETTERS_CHKBOX'
export const UPDATE_ENDING_LETTERS_CHKBOX = 'UPDATE_ENDING_LETTERS_CHKBOX'
export const UPDATE_SPECIFIC_WORD_CHKBOX = 'UPDATE_SPECIFIC_WORD_CHKBOX'
export const UPDATE_REALM = 'UPDATE_REALM'
export const UPDATE_SETTINGS_PREFERENCES = 'UPDATE_SETTINGS_PREFERENCES'
export const UPDATE_STARTING_LETTERS_TEXT = 'UPDATE_STARTING_LETTERS_TEXT'
export const UPDATE_ENDING_LETTERS_TEXT = 'UPDATE_ENDING_LETTERS_TEXT'
export const UPDATE_SPECIFIC_WORD_TEXT = 'UPDATE_SPECIFIC_WORD_TEXT'
export const UPDATE_API_URL = 'UPDATE_API_URL'
export const DISPLAY_CHANGE_PREFS_BTN = 'DISPLAY_CHANGE_PREFS_BTN'
export const DISPLAY_VOCABULARY_OVERLAY = 'DISPLAY_VOCABULARY_OVERLAY'
export const HIDE_VOCABULARY_OVERLAY = 'HIDE_VOCABULARY_OVERLAY'
export const UPDATE_VOCABULARY_WORD = 'UPDATE_VOCABULARY_WORD'
export const UPDATE_VOCABULARY_PART_OF_SPEECH = 'UPDATE_VOCABULARY_PART_OF_SPEECH'
export const UPDATE_VOCABULARY_DEFINITION = 'UPDATE_VOCABULARY_DEFINITION'
export const UPDATE_VOCABULARY_PRONUNCIATION = 'UPDATE_VOCABULARY_PRONUNCIATION'
export const UPDATE_VOCABULARY_FREQUENCY = 'UPDATE_VOCABULARY_FREQUENCY'
export const CLEAR_LIST_OF_WORDS = 'CLEAR_LIST_OF_WORDS'
export const UPDATE_LIST_OF_WORDS = 'UPDATE_LIST_OF_WORDS'
export const DELETE_WORD_IN_LIST = 'DELETE_WORD_IN_LIST'
export const UPDATE_SEARCH_VALUE = 'UPDATE_SEARCH_VALUE'
export const UPDATE_SEARCH_RESULTS = 'UPDATE_SEARCH_RESULTS'
export const UPDATE_REVIEW_CONTENT = 'UPDATE_REVIEW_CONTENT'
export const SHOW_NO_VOCABULARY = 'SHOW_NO_VOCABULARY'
export const RESET_REVIEW_LAYOUT = 'RESET_REVIEW_LAYOUT'
export const SHOW_REVIEW_OVER = 'SHOW_REVIEW_OVER'

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

export function displayWordDefinition() {
    return {
        type: DISPLAY_WORD_DEFINITION
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

export function updateRealm(realmObject) {
    return {
        type: UPDATE_REALM,
        data: realmObject
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

export function clearListOfWords() {
    return {
        type: CLEAR_LIST_OF_WORDS
    }
}
export function displayVocabularyOverlay(docSnapshotData){
    return {
        type: DISPLAY_VOCABULARY_OVERLAY,
        data: docSnapshotData
    }
}

export function hideVocabularyOverlay() {
    return {
        type: HIDE_VOCABULARY_OVERLAY
    }
}

export function updateVocabularyWord(word) {
    return {
        type: UPDATE_VOCABULARY_WORD,
        data: word
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

export function updateVocabularyPartOfSpeech(partOfSpeech) {
    return {
        type: UPDATE_VOCABULARY_PART_OF_SPEECH,
        data: partOfSpeech
    }
}

export function updateVocabularyDefinition(definition) {
    return {
        type: UPDATE_VOCABULARY_DEFINITION,
        data: definition
    }
}

export function updateVocabularyPronunciation(pronunciation) {
    return {
        type: UPDATE_VOCABULARY_PRONUNCIATION,
        data: pronunciation
    }
}

export function updateVocabularyFrequency(frequency) {
    return {
        type: UPDATE_VOCABULARY_FREQUENCY,
        data: frequency
    }
}

export function updateReviewContent(wordLabel) {
    return {
        type: UPDATE_REVIEW_CONTENT,
        data: wordLabel
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