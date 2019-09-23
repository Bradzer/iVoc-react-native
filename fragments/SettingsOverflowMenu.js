import React from 'react';
import { View, } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import { Icon, } from 'react-native-elements'
import firebase from 'react-native-firebase'
import { inject, observer } from 'mobx-react'
import { reaction, } from 'mobx'

import AppConstants from '../constants/Constants'
import reactotron from '../ReactotronConfig';

class SettingsOverflowMenu extends React.Component {

  store = this.props.store

  closeMenuReactionDisposer = reaction(
    () => this.store.closeSettingsMenu,
    closeSettingsMenu => {
        if(closeSettingsMenu) {
          this.hideAllMenu()
          this.store.setCloseSettingsMenu(false)      
        }
    }
)

    render() {
        return (
            <View>
            <Menu ref={component => this._settingsMenu = component} onOpen={this.onMenuOpen} onClose={this.onMenuClose}>
              <MenuTrigger>
              <Icon name='more-vert' color={AppConstants.COLOR_WHITE} />
               </MenuTrigger>
               <MenuOptions>
                <MenuOption text={AppConstants.STRING_ABOUT} customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={() => this.props.navigation.navigate('About')}/>
                <MenuOption text={AppConstants.STRING_SIGN_OUT} customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={() => onSignOutSelected()} />
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

    onMenuOpen = () => {
        this.store.setSettingsMenuOpen(true)
    }

    onMenuClose = () => {
        this.store.setSettingsMenuOpen(false)
    }

    hideAllMenu = () => {
      this._settingsMenu.close()
      .then(() => reactotron.log("main menu SETTINGS closed"), () => reactotron.log("ERROR: can't close main menu SETTINGS"))
    }

    onSignOutSelected = () => {
        this.store.setCloseMenu(true)
        firebase.auth().signOut()
      }
}

export default inject('store')(observer(SettingsOverflowMenu))

function onSignOutSelected() {
    firebase.auth().signOut()
  }
