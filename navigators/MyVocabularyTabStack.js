import { createStackNavigator, } from 'react-navigation';

import MyVocabulary from '../screens/MyVocabulary'

const MyVocabularyStackAppNavigator = createStackNavigator({
    MyVocabulary
  },
  {
    initialRouteName: 'MyVocabulary'
  })

export default MyVocabularyStackAppNavigator