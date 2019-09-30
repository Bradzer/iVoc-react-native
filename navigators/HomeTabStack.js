import { createStackNavigator } from 'react-navigation';

import Home from '../screens/Home'
import RandomPractice from '../screens/RandomPractice'
import ReviewVocabulary from '../screens/ReviewVocabulary'
import About from '../screens/About'
import AppConstants from '../constants/Constants'

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

  export default HomeTabStackNavigator
  
