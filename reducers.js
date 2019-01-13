import { createStore } from 'redux'

import { CHANGE_TITLE, CHANGE_SUBTITLE, CHANGE_KEY, CHANGE_LIST_ITEM, ADD_RESPONSE_DATA, RESET_RESPONSE_DATA, DISPLAY_WORD_DEFINITION, displayWordDefinition } from './actions'

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
    displayWordDefinition: 'none',
    buttonRightIconName: 'x-circle',
    buttonRightIconType: 'foundation',
    buttonRightTitle: "I don't know this",
    buttonLeftIconName: 'checkbox-marked-circle',
    buttonLeftIconType:'material-community',
    buttonLeftTitle:"I know this",
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
                displayWordDefinition: 'none'
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
        default:
            return state
    }
}

const store = createStore(reducer)

export default store