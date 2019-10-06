import { createStackNavigator } from 'react-navigation-stack';

import Settings from '../screens/Settings'
import About from '../screens/About'
import UsedLibraries from '../screens/UsedLibraries'
import AppConstants from '../constants/Constants'

const SettingsStackAppNavigator = createStackNavigator({
    Settings,
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
    initialRouteName: 'Settings'
  })

export default SettingsStackAppNavigator