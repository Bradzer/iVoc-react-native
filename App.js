import React from 'react';
import { View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import { Icon } from 'react-native-elements'
import { Provider } from 'react-redux'

import Home from './components/Home'
import MyVocabulary from './components/MyVocabulary'
import Settings from './components/Settings'
import RandomPractice from './components/RandomPractice'
import Startup from './components/Startup'
import ReviewVocabulary from './components/ReviewVocabulary'
import AppConstants from './Constants'
import store from './reducers'

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
      specificWordChecked: 'bool?',
      updatedIndex: 'int?',
      startingLettersText: 'string?',
      endingLettersText: 'string?',
      specificWordText: 'string?',
      apiUrl: 'string?'
  }
}

Realm.open({schema: [settingsScreenSchema]})

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
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
  }
},
{
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: AppConstants.APP_PRIMARY_COLOR
    },
    headerTintColor: AppConstants.COLOR_WHITE,
    headerRight: (
      <View>
        <Menu>
          <MenuTrigger>
          <Icon name='more-vert' color={AppConstants.COLOR_WHITE} />
           </MenuTrigger>
           <MenuOptions>
             <MenuOption text={AppConstants.STRING_PREFERENCES} />
             <MenuOption text={AppConstants.STRING_ABOUT} />
           </MenuOptions>
        </Menu>
      </View>
    )
  },
  initialRouteName: 'Home'
})

const TabAppNavigator = createMaterialBottomTabNavigator({
  HomeTabStackNavigator: {
    screen: HomeTabStackNavigator,
    navigationOptions: {
      tabBarLabel: AppConstants.STRING_TAB_HOME,
      tabBarIcon: <Icon name= 'home' />
    }
  },
  MyVocabulary: MyVocabulary,
  Settings: Settings,
},
{
  initialRouteName: 'HomeTabStackNavigator',
})

const StackAppNavigator = createStackNavigator({
  TabAppNavigator: {
    screen: TabAppNavigator,
  }
},
  {
    defaultNavigationOptions: {
      header: null,
    }
  })

const AppContainer = createAppContainer(StackAppNavigator);