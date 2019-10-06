import { createStackNavigator } from 'react-navigation-stack';

import Settings from '../screens/Settings'
import AboutStack from './AboutStack'
import AppConstants from '../constants/Constants'

const SettingsStackAppNavigator = createStackNavigator({
    Settings,
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
    initialRouteName: 'Settings'
  })

export default SettingsStackAppNavigator