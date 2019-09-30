import { createStackNavigator } from 'react-navigation';

import Settings from '../screens/Settings'
import About from '../screens/About'

const SettingsStackAppNavigator = createStackNavigator({
    Settings,
    About
  },
  {
    initialRouteName: 'Settings'
  })

export default SettingsStackAppNavigator