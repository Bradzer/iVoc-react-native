import Reactotron from 'reactotron-react-native'

Reactotron
  .configure({host: '10.0.70.86'}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect() // let's connect!