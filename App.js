import React from 'react';
import { createAppContainer } from 'react-navigation';
import { MenuProvider, } from 'react-native-popup-menu';
// import { Provider } from 'react-redux'
import { Provider } from 'mobx-react'

import HomeTabStack from './navigators/HomeTabStack'
import MyVocabularyStack from './navigators/MyVocabularyTabStack'
import SettingsStack from './navigators/SettingsTabStack'
import BottomTab from './navigators/BottomTab'
import Switch from './navigators/Switch'
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
      partOfSpeechIndex: 'int?',
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

const HomeTabStackNavigator = HomeTabStack

const MyVocabularyStackAppNavigator = MyVocabularyStack

const SettingsStackAppNavigator = SettingsStack

const TabAppNavigator = BottomTab

const SwitchAppNavigator = Switch

const AppContainer = createAppContainer(SwitchAppNavigator);