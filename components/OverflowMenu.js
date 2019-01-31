import React from 'react';
import { View, } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import { Icon, } from 'react-native-elements'
import firebase from 'react-native-firebase'

import AppConstants from '../Constants'

export default function OverflowMenu(props) {
    return (
      <View>
      <Menu>
        <MenuTrigger>
        <Icon name='more-vert' color={AppConstants.COLOR_WHITE} />
         </MenuTrigger>
         <MenuOptions>
          <MenuOption text={AppConstants.STRING_TAB_HOME} onSelect={() => props.navigation.navigate('Home')}/>
          <MenuOption text={AppConstants.STRING_TAB_MY_VOCABULARY} onSelect={() => props.navigation.navigate('MyVocabulary')}/>
          <MenuOption text={AppConstants.STRING_TAB_SETTINGS} onSelect={() => props.navigation.navigate('Settings')}/>
          <MenuOption text={AppConstants.STRING_ABOUT} />
          <MenuOption text={AppConstants.STRING_SIGN_OUT} onSelect={() => onSignOutSelected()} />
         </MenuOptions>
      </Menu>
    </View>
    )
  }
  
  function onSignOutSelected() {
    firebase.auth().signOut()
  }