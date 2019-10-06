import { createStackNavigator } from 'react-navigation-stack';

import Home from '../screens/Home'
import RandomPractice from '../screens/RandomPractice'
import ReviewVocabulary from '../screens/ReviewVocabulary'
import About from '../screens/About'
import UsedLibraries from '../screens/UsedLibraries'
import AppConstants from '../constants/Constants'

const HomeTabStackNavigator = createStackNavigator({
    Home: Home,
    RandomPractice: {
      screen: RandomPractice
    },
    ReviewVocabulary: {
      screen: ReviewVocabulary
    },
    About: About,
    UsedLibraries: UsedLibraries
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
  
