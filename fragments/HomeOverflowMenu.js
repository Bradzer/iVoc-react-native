/* eslint-disable react/prop-types */
import React from 'react';
import { View, } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import { Icon, } from 'react-native-elements'
import firebase from 'react-native-firebase'
import { inject, observer } from 'mobx-react'
import { reaction, } from 'mobx'

import AppConstants from '../constants/Constants'
import reactotron from '../ReactotronConfig';

class HomeOverflowMenu extends React.Component {
    
    store = this.props.store

    closeMenuReactionDisposer = reaction(
        () => this.store.closeHomeMenu,
        closeHomeMenu => {
            if(closeHomeMenu) {
            this.hideAllMenu()
            this.store.setCloseHomeMenu(false)
            }
        }
    )

    render() {
        return (
            <View>
            <Menu ref={component => this._homeMenu = component} onOpen={this.onMenuOpen} onClose={this.onMenuClose}>
              <MenuTrigger>
              <Icon name='more-vert' color={AppConstants.COLOR_WHITE} />
               </MenuTrigger>
               <MenuOptions>
                <MenuOption text={AppConstants.STRING_TAB_MY_VOCABULARY} customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={() => this.props.navigation.navigate('MyVocabulary')}/>
                <MenuOption text={AppConstants.STRING_TAB_SETTINGS} customStyles={{optionText: {fontSize: 18, color: 'black'}}} onSelect={() => this.props.navigation.navigate('Settings')}/>
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
        this.store.setHomeMenuOpen(true)
    }

    onMenuClose = () => {
        this.store.setHomeMenuOpen(false)
    }

    hideAllMenu = () => {
      this._homeMenu.close()
      .then(() => reactotron.log("main menu HOME closed"), () => reactotron.log("ERROR: can't close main menu HOME"))
    }
}

export default inject('store')(observer(HomeOverflowMenu))

function onSignOutSelected() {
    firebase.auth().signOut()
  }