import React from 'react';
import { View, } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import { Icon, } from 'react-native-elements'
import firebase from 'react-native-firebase'

import AppConstants from '../constants/Constants'

export const HomeOverflowMenu = (props) => {
    return (
      <View>
      <Menu>
        <MenuTrigger>
        <Icon name='more-vert' color={AppConstants.COLOR_WHITE} />
         </MenuTrigger>
         <MenuOptions>
          <MenuOption text={AppConstants.STRING_TAB_MY_VOCABULARY} customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={() => props.navigation.navigate('MyVocabulary')}/>
          <MenuOption text={AppConstants.STRING_TAB_SETTINGS} customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={() => props.navigation.navigate('Settings')}/>
          <MenuOption text={AppConstants.STRING_ABOUT} customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={() => props.navigation.navigate('About')}/>
          <MenuOption text={AppConstants.STRING_SIGN_OUT} customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={() => onSignOutSelected()} />
         </MenuOptions>
      </Menu>
    </View>
    )
  }

export const MyVocabularyOverflowMenu = (props) => {
  return (
    <View>
    <Menu>
      <MenuTrigger>
      <Icon name='more-vert' color={AppConstants.COLOR_WHITE} />
       </MenuTrigger>
       <MenuOptions>
        <MenuOption text='Multi deletion' customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={() => multiDeletionPressed(props.navigation)}/>
        <MenuOption text='Clear all' customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={() => clearVocabularyList(props.navigation)}/>
       </MenuOptions>
    </Menu>
  </View>
  )
}

export const SettingsOverflowMenu = (props) => {
  return (
    <View>
    <Menu>
      <MenuTrigger>
      <Icon name='more-vert' color={AppConstants.COLOR_WHITE} />
       </MenuTrigger>
       <MenuOptions>
        <MenuOption text={AppConstants.STRING_ABOUT} customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={() => props.navigation.navigate('About')}/>
        <MenuOption text={AppConstants.STRING_SIGN_OUT} customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={() => onSignOutSelected()} />
       </MenuOptions>
    </Menu>
  </View>
  )
}
  
  function onSignOutSelected() {
    firebase.auth().signOut()
  }

  function clearVocabularyList(navigation) {

    let userWordsDetailsCollection = firebase.firestore().collection('wordsDetails/' + firebase.auth().currentUser.uid + '/userWordsDetails')

    userWordsDetailsCollection.get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => firebase.firestore().batch().delete(doc.ref).commit()), (error) => console.log(error)
      let showClearDoneToast = navigation.getParam('showClearDoneToast')
      showClearDoneToast()
      let searchBarValue = navigation.getParam('getSearchBarValue')
      searchBarValue = searchBarValue()
      let onSearchValueChanged = navigation.getParam('onSearchValueChanged')
      onSearchValueChanged(searchBarValue)
    })
  }

  function multiDeletionPressed(navigation) {
    let showMultiDeletionOnToast = navigation.getParam('showMultiDeletionOnToast')
    showMultiDeletionOnToast()
    let setMultiDeletionStatus = navigation.getParam('setMultiDeletionStatus')
    setMultiDeletionStatus(true)
  }