import React, { Component } from "react";

import styles from "./style";
import {Keyboard, Text, View, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView} from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase'
import reactotron from "../ReactotronConfig";

// const appId = "1047121222092614"

const firebaseAuth = firebase.auth

let username = ''
let password = ''

export default class LoginScreen extends Component {

  render() {
    return (
      <KeyboardAvoidingView style={styles.containerView} behavior="padding">

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
          <Text style={styles.logoText}>Instamobile</Text>
            <TextInput placeholder="Username" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} onChangeText={(usernameText) => usernameChanged(usernameText)}/>
            <TextInput placeholder="Password" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} secureTextEntry={true} onChangeText={(passwordText) => passwordChanged(passwordText)}/>
            <Button
              buttonStyle={styles.loginButton}
              onPress={() => this.onLoginPress()}
              title="Login"
            />
            {/* <Button
              buttonStyle={styles.fbLoginButton}
              onPress={() => this.onFbLoginPress()}
              title="Login with Facebook"
              color="#3897f1"
            /> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onLoginPress() {
    reactotron.logImportant('user : ', username)
    reactotron.logImportant('pass : ', password)
    // this.props.navigation.navigate('Home')
  }

  // async onFbLoginPress() {
  //   const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(appId, {
  //     permissions: ['public_profile', 'email'],
  //   });
  //   if (type === 'success') {
  //     const response = await fetch(
  //       `https://graph.facebook.com/me?access_token=${token}`);
  //     Alert.alert(
  //       'Logged in!',
  //       `Hi ${(await response.json()).name}!`,
  //     );
  //   }
  // }
}

const usernameChanged = (usernameText) => {
  username = usernameText
}

const passwordChanged = (passwordText) => {
  password = passwordText
}