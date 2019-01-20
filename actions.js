export const CHANGE_TITLE = 'CHANGE_TITLE'
export const CHANGE_SUBTITLE = 'CHANGE_SUBTITLE'
export const CHANGE_KEY = 'CHANGE_KEY'
export const CHANGE_LIST_ITEM = 'CHANGE_LIST_ITEM'
export const ADD_RESPONSE_DATA = 'ADD_RESPONSE_DATA'
export const RESET_RESPONSE_DATA = 'RESET_RESPONSE_DATA'
export const DISPLAY_WORD_DEFINITION = 'DISPLAY_WORD_DEFINITION'
export const UPDATE_INDEX = 'UPDATE_INDEX'
export const UPDATE_STARTING_LETTERS_CHKBOX = 'UPDATE_STARTING_LETTERS_CHKBOX'
export const UPDATE_ENDING_LETTERS_CHKBOX = 'UPDATE_ENDING_LETTERS_CHKBOX'
export const UPDATE_REALM = 'UPDATE_REALM'

export function changeTitle(title) {
    return {
        type: CHANGE_TITLE,
        title: title,
    }
}

export function changeSubtitle(subtitle) {
    return {
        type: CHANGE_SUBTITLE,
        subtitle: subtitle,
    }
}

export function changeKey(key) {
    return {
        type: CHANGE_KEY,
        key: key,
    }
}

export function changeListItem(itemData) {
    return {
        type: CHANGE_LIST_ITEM,
        itemData: itemData
    }
}

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

export function updateStartingLettersCheckBox() {
    return {
        type: UPDATE_STARTING_LETTERS_CHKBOX
    }
}

export function updateEndingLettersCheckBox() {
    return {
        type: UPDATE_ENDING_LETTERS_CHKBOX
    }
}

export function updateReal(realmObject) {
    return {
        type: UPDATE_REALM,
        data: realmObject
    }
} 