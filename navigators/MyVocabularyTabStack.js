import { createStackNavigator, } from 'react-navigation-stack';

import MyVocabulary from '../screens/MyVocabulary'

const MyVocabularyStackAppNavigator = createStackNavigator({
    MyVocabulary
  },
  {
    initialRouteName: 'MyVocabulary'
  })

export default MyVocabularyStackAppNavigator