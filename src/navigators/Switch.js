import { createSwitchNavigator } from 'react-navigation';

import BottomTab from './BottomTab'
import LoginScreen from '../screens/login'

const SwitchAppNavigator = createSwitchNavigator({
    LoginScreen,
    TabAppNavigator: {
      screen: BottomTab,
    }  
  },
  {
    backBehavior: 'initialRoute',
    initialRouteName: 'LoginScreen',  
  })

export default SwitchAppNavigator