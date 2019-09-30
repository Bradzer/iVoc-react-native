import { createStackNavigator } from 'react-navigation';

import About from '../screens/About'
import UsedLibraries from '../screens/UsedLibraries'

const AboutStackNavigator = createStackNavigator({
    About: {
        screen: About,
        navigationOptions: {
            header: null
        }
    },
    UsedLibraries: {
        screen: UsedLibraries,
        navigationOptions: {
            header: null
        }
    }
},
)

export default AboutStackNavigator
