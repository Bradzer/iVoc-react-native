import React from 'react';
import { View, } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import { Icon, } from 'react-native-elements'
import firebase from 'react-native-firebase'
import { inject, observer } from 'mobx-react'

import AppConstants from '../Constants'

class MyVocabularyOverflowMenu extends React.Component {
    
    store = this.props.store

    render() {
        return (
            <View>
            <Menu>
              <MenuTrigger>
              <Icon name='more-vert' color={AppConstants.COLOR_WHITE} />
               </MenuTrigger>
               <MenuOptions>
                <MenuOption text={this.store.multiDeletionMenuOption} customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={this.multiDeletionOptionPressed}/>
                <MenuOption text='Clear all' customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={this.clearVocabularyList}/>
               </MenuOptions>
            </Menu>
          </View>
        )        
    }

    clearVocabularyList = () => {

        let userWordsDetailsCollection = firebase.firestore().collection('wordsDetails/' + firebase.auth().currentUser.uid + '/userWordsDetails')
    
        userWordsDetailsCollection.get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => firebase.firestore().batch().delete(doc.ref).commit()), (error) => console.log(error)
          this.store.setVocabularyClearDone(true)
        })
    }

    multiDeletionOptionPressed = () => {
        if(this.store.multiDeletionStatus) this.store.setMultiDeletionStatus(false)
        else this.store.setMultiDeletionStatus(true)
    }
}

export default inject('store')(observer(MyVocabularyOverflowMenu))