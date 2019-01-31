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
           <MenuOption text={AppConstants.STRING_PREFERENCES} onSelect={() => props.navigation.navigate('Settings')}/>
           <MenuOption text={AppConstants.STRING_ABOUT} />
           <MenuOption text={AppConstants.STRING_SIGN_OUT} onSelect={() => onSignOutSelected(props.navigation)} />
         </MenuOptions>
      </Menu>
    </View>
    )
  }
  
  function onSignOutSelected(navigation) {
    firebase.auth().signOut()
    // navigation.navigate('LoginScreen')
  }