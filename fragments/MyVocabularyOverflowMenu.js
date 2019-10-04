import React from 'react';
import { View, ToastAndroid, } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import { Icon, CheckBox, } from 'react-native-elements'
import firebase from 'react-native-firebase'
import { inject, observer } from 'mobx-react'
import { reaction, } from 'mobx'
import PropTypes from 'prop-types';

import AppConstants from '../constants/Constants'
import Toasts from '../constants/Toasts'
import reactotron from '../ReactotronConfig';

class MyVocabularyOverflowMenu extends React.Component {
    
    store = this.props.store

    closeMenuReactionDisposer = reaction(
      () => this.store.closeVocMenu,
      closeVocMenu => {
          if(closeVocMenu) {
            this.store.setIsSortBy(false)
            this.hideAllMenu()
            this.store.setCloseVocMenu(false)
          }
      }
  )

    render() {
        return (
          <View>
          <Menu ref={component => this._VocMenu = component} onOpen={this.onMenuOpen} onClose={this.onMenuClose}>
            <MenuTrigger>
            <Icon name='more-vert' color={AppConstants.COLOR_WHITE}/>
             </MenuTrigger>
             <MenuOptions>
               {
                 this.store.isSortBy
                 ?
                 <View>
                   <MenuOption>
                    <CheckBox 
                     title='Default'
                     checked={this.store.defaultChecked}
                     onPress={this.onDefaultSortPressed}
                    />
                    <CheckBox 
                     title='Alphabetical'
                     checked={this.store.alphabeticalChecked}
                     onPress={this.onAlphabeticalSortPressed}
                    />
                    <CheckBox
                     title='Alphabetical (reverse)'
                     checked={this.store.alphabeticalReverseChecked}
                     onPress={this.onAlphabeticalReverseSortPressed}
                    />
                    <CheckBox 
                     title='Length'
                     checked={this.store.lengthChecked}
                     onPress={this.onLengthSortPressed}
                    />
                    <CheckBox 
                     title='Length (descending)'
                     checked={this.store.lengthDescendingChecked}
                     onPress={this.onLengthDescendingSortPressed}
                    />
                   </MenuOption>
                </View>
                :
                <View>
                <MenuOption text='Sort type' customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={this.onSortByPressed}/> 
                <MenuOption text={this.store.multiDeletionMenuOption} customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={this.multiDeletionOptionPressed}/>
                <MenuOption text='Clear all' customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={this.clearVocabularyList}/>
                </View>
               }
             </MenuOptions>
          </Menu>
        </View>
        )        
    }

    componentDidMount() {
    }

    componentWillUnmount() {
      this.closeMenuReactionDisposer && this.closeMenuReactionDisposer()
    }

    onSortByPressed = () => {
      if(this.store.multiDeletionStatus) this.store.setMultiDeletionStatus(false)
      this.openSortMenu()
    }

    onMenuOpen = () => {
      this.store.setVocMenuOpen(true)
    }

    onMenuClose = () => {
      if(this.store.isSortBy) this.store.setIsSortBy(false)
      this.store.setVocMenuOpen(false)
    }

    hideAllMenu = () => {
      this._VocMenu.close()
      .then(() => reactotron.log("main menu closed"), () => reactotron.log("ERROR: can't close main menu"))
    }

    openSortMenu = () => {
      this._VocMenu.close()
      .then(() => {
        reactotron.log("main menu closed")
      }, () => reactotron.log("ERROR: can't close main menu"))
      .then(() => {
        this.store.setIsSortBy(true)
        this.openMainMenu()
      })
    }

    openMainMenu = () => {
      this._VocMenu.open()
      .then(() => {
        reactotron.log("main menu open")
      }, () => reactotron.log("ERROR: can't open main menu"))
    }

    clearVocabularyList = () => {

        let userWordsDetailsCollection = firebase.firestore().collection('wordsDetails/' + firebase.auth().currentUser.uid + '/userWordsDetails')
    
        userWordsDetailsCollection.get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => firebase.firestore().batch().delete(doc.ref).commit()), () => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT)
          this.store.setVocabularyClearDone(true)
          this.store.setMultiDeletionStatus(false)
        })
    }

    multiDeletionOptionPressed = () => {
        if(this.store.multiDeletionStatus) this.store.setMultiDeletionStatus(false)
        else this.store.setMultiDeletionStatus(true)
    }

    onDefaultSortPressed = () => {
      this.store.enableDefaultSort()
    }

    onAlphabeticalSortPressed = () => {
      this.store.enableAlphabeticalSort()
    }

    onAlphabeticalReverseSortPressed = () => {
      this.store.enableAlphabeticalReverseSort()
    }

    onLengthSortPressed = () => {
      this.store.enableLengthSort()
    }

    onLengthDescendingSortPressed = () => {
      this.store.enableLengthDescendingSort()
    }
}

export default inject('store')(observer(MyVocabularyOverflowMenu))

MyVocabularyOverflowMenu.propTypes = {
  store: PropTypes.object.isRequired,
}