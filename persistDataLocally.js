import { CHANGE_TITLE, CHANGE_SUBTITLE, CHANGE_KEY, CHANGE_LIST_ITEM, ADD_RESPONSE_DATA, RESET_RESPONSE_DATA, DISPLAY_WORD_DEFINITION, UPDATE_INDEX, UPDATE_STARTING_LETTERS_CHKBOX, UPDATE_ENDING_LETTERS_CHKBOX } from './actions'

const Realm = require('realm');

// const settingsScreenSchema = {
//     name: 'settingsScreen',
//     primaryKey: 'pk',
//     properties: {
//         pk: 'int',
//         startingLettersChecked: 'bool?',
//         endingLettersChecked: 'bool?',
//         updatedIndex: 'int?'
//     }
// }

const persistDataLocally = store => next => action => {

// const realm = new Realm()

// realm.close() 

    switch(action.type) {
        
        case UPDATE_INDEX:
            console.log('CASE : UPDATE INDEX')
            Realm.open({})
            .then((realm) => {
                realm.write(() => {
                    console.log('PREPARING TO WRITE...')
                    console.log(realm.objects('settingsScreen').isValid())
                    if(realm.objects('settingsScreen').isValid()) {
                        console.log('SETTINGS SCREEN SCHEMA IS VALID')
                        if(!(realm.objects('settingsScreen').isEmpty())) {
                            console.log('COLLECTION NOT EMPTY')
                            realm.objects('settingsScreen').filtered('pk = 0').update('updatedIndex', action.data)
                        }
                        else{
                            console.log('COLLECTION EMPTY')
                            realm.create('settingsScreen', { pk: 0, updatedIndex: action.data })
                        }
                    }
                    else {
                        console.log('SETTINGS SCREEN SCHEMA NOT FOUND')
                        realm.create('settingsScreen', { pk: 0, updatedIndex: action.data })
                    } 
                })
            })
            break;

        default:
            Realm.open({})
            .then(realm => realm.deleteModel('settingsScreen'))
            break;
    }
    next(action)
}
  
  export default persistDataLocally;