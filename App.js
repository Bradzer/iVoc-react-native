import React from 'react';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { MenuProvider, } from 'react-native-popup-menu';
import { Icon } from 'react-native-elements'
// import { Provider } from 'react-redux'
import { Provider } from 'mobx-react'

import LoginScreen from './components/login'
import Home from './components/Home'
import MyVocabulary from './components/MyVocabulary'
import Settings from './components/Settings'
import RandomPractice from './components/RandomPractice'
import ReviewVocabulary from './components/ReviewVocabulary'
import About from './components/About'
import AppConstants from './Constants'
// import store from './reducers'
import State from './models/State'

const Realm = require('realm');
const realm = new Realm()
realm.close()

const settingsScreenSchema = {
  name: 'settingsScreen',
  primaryKey: 'pk',
  properties: {
      pk: 'int',
      startingLettersChecked: 'bool?',
      endingLettersChecked: 'bool?',
      partialLettersChecked: 'bool?',
      specificWordChecked: 'bool?',
      onlyPronunciationWordChecked: 'bool?',
      updatedIndex: 'int?',
      startingLettersText: 'string?',
      endingLettersText: 'string?',
      partialLettersText: 'string?',
      specificWordText: 'string?',
      apiUrl: 'string?'
  }
}

Realm.open({schema: [settingsScreenSchema]})

export default class App extends React.Component {

  render() {
    return (
      <Provider store={State}>
        <MenuProvider>
          <AppContainer />
        </MenuProvider>
      </Provider>
    );
  }
}

const HomeTabStackNavigator = createStackNavigator({
  Home: Home,
  RandomPractice: {
    screen: RandomPractice
  },
  ReviewVocabulary: {
    screen: ReviewVocabulary
  },
  About,
},
{
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: AppConstants.APP_PRIMARY_COLOR
    },
    headerTintColor: AppConstants.COLOR_WHITE,
  },
  initialRouteName: 'Home'
})

const MyVocabularyStackAppNavigator = createStackNavigator({
  MyVocabulary
},
{
  initialRouteName: 'MyVocabulary'
})

const SettingsStackAppNavigator = createStackNavigator({
  Settings,
  About
},
{
  initialRouteName: 'Settings'
})

const TabAppNavigator = createMaterialBottomTabNavigator({
  HomeTabStackNavigator: {
    screen: HomeTabStackNavigator,
    navigationOptions: {
      tabBarLabel: AppConstants.STRING_TAB_HOME,
      tabBarIcon: <Icon name= 'home' />
    }
  },
  MyVocabularyStackAppNavigator: {
    screen: MyVocabularyStackAppNavigator,
    navigationOptions: {
      tabBarLabel: AppConstants.STRING_TAB_MY_VOCABULARY,
      tabBarIcon: <Icon name= 'file-document' type= 'material-community'/>
  },
},
  SettingsStackAppNavigator: {
    screen: SettingsStackAppNavigator,
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

  const SwitchAppNavigator = createSwitchNavigator({
    LoginScreen,
    TabAppNavigator: {
      screen: TabAppNavigator,
    }  
  },
  {
    backBehavior: 'initialRoute',
    initialRouteName: 'LoginScreen',  
  })

const AppContainer = createAppContainer(SwitchAppNavigator);