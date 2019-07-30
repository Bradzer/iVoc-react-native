import React from 'react';
import { View, } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import { Icon, } from 'react-native-elements'
import firebase from 'react-native-firebase'
import { inject, observer } from 'mobx-react'

import AppConstants from '../Constants'
import reactotron from '../ReactotronConfig';

class MyVocabularyOverflowMenu extends React.Component {
    
    store = this.props.store

    // navigation = this.props.navigation

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

    componentDidMount() {

    }

    clearVocabularyList = () => {

        let userWordsDetailsCollection = firebase.firestore().collection('wordsDetails/' + firebase.auth().currentUser.uid + '/userWordsDetails')
    
        userWordsDetailsCollection.get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => firebase.firestore().batch().delete(doc.ref).commit()), (error) => console.log(error)
          let showClearDoneToast = this.props.navigationProp.getParam('showClearDoneToast')
          showClearDoneToast()
          let searchBarValue = this.props.navigationProp.getParam('getSearchBarValue')
          searchBarValue = searchBarValue()
          let onSearchValueChanged = this.props.navigationProp.getParam('onSearchValueChanged')
          onSearchValueChanged(searchBarValue)
        })
    }

    multiDeletionOptionPressed = () => {
        reactotron.log(this.store.multiDeletionStatus)
        if(this.store.multiDeletionStatus) {
            let showMultiDeletionOffToast = this.props.navigationProp.getParam('showMultiDeletionOffToast')
            showMultiDeletionOffToast()
            this.store.setMultiDeletionStatus(false)
            this.store.disableVocabularyListPulseAnimation()
            this.store.enableMultiDeletionMenuOption()
        }
        else {
            let showMultiDeletionOnToast = this.props.navigationProp.getParam('showMultiDeletionOnToast')
            showMultiDeletionOnToast()
            this.store.setMultiDeletionStatus(true)
            this.store.enableVocabularyListPulseAnimation()
            this.store.disableMultiDeletionMenuOption()
        }
    }
}

export default inject('store')(observer(MyVocabularyOverflowMenu))