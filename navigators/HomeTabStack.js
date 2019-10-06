import { createStackNavigator } from 'react-navigation-stack';

import Home from '../screens/Home'
import RandomPractice from '../screens/RandomPractice'
import ReviewVocabulary from '../screens/ReviewVocabulary'
import AboutStack from './AboutStack'
import AppConstants from '../constants/Constants'

const HomeTabStackNavigator = createStackNavigator({
    Home: Home,
    RandomPractice: {
      screen: RandomPractice
    },
    ReviewVocabulary: {
      screen: ReviewVocabulary
    },
    AboutStack: {
      screen: AboutStack
    }
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

  export default HomeTabStackNavigator
  
