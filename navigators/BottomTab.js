import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Icon } from 'react-native-elements'

import HomeTabStack from './HomeTabStack'
import MyVocabularyStack from './MyVocabularyTabStack'
import SettingsStack from './SettingsTabStack'
import AppConstants from '../constants/Constants'

const TabAppNavigator = createMaterialBottomTabNavigator({
    HomeTabStackNavigator: {
      screen: HomeTabStack,
      navigationOptions: {
        tabBarLabel: AppConstants.STRING_TAB_HOME,
        tabBarIcon: <Icon name= 'home' />
      }
    },
    MyVocabularyStackAppNavigator: {
      screen: MyVocabularyStack,
      navigationOptions: {
        tabBarLabel: AppConstants.STRING_TAB_MY_VOCABULARY,
        tabBarIcon: <Icon name= 'file-document' type= 'material-community'/>
    },
  },
    SettingsStackAppNavigator: {
      screen: SettingsStack,
      navigationOptions: {
        tabBarLabel: AppConstants.STRING_TAB_SETTINGS,
        tabBarIcon: <Icon name= 'settings' />
      },
    },
  },
  {
    activeTintColor: 'white',
    barStyle: {backgroundColor: AppConstants.APP_PRIMARY_COLOR},
    initialRouteName: 'HomeTabStackNavigator',
  })
  
export default TabAppNavigator