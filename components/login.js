import React, { Component } from "react";

import styles from "./style";
import {Keyboard, Text, View, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView} from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase'
import reactotron from "../ReactotronConfig";

// const appId = "1047121222092614"

const firebaseAuth = firebase.auth()

let username = ''
let password = ''

export default class LoginScreen extends Component {

  render() {
    return (
      <KeyboardAvoidingView style={styles.containerView} behavior="padding">

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
          <Text style={styles.logoText}>iVoc</Text>
            <TextInput placeholder="E-mail" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} onChangeText={(usernameText) => usernameChanged(usernameText)}/>
            <TextInput placeholder="Password" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} secureTextEntry={true} onChangeText={(passwordText) => passwordChanged(passwordText)}/>
            <Button
              buttonStyle={styles.loginButton}
              onPress={() => this.onLoginPress()}
              title="Login"
            />
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
    firebaseAuth.signInAnonymously().then((credentials) => reactotron.logImportant('log in successful', credentials), (error) => reactotron.logImportant(error))
    // this.props.navigation.navigate('Home')
  }
}

const usernameChanged = (usernameText) => {
  username = usernameText
}

const passwordChanged = (passwordText) => {
  password = passwordText
}