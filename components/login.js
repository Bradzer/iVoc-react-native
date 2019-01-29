import React, { Component } from "react";

import styles from "./style";
import {Keyboard, Text, View, TextInput, TouchableWithoutFeedback, StyleSheet, KeyboardAvoidingView} from 'react-native';
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
            <Button 
            containerStyle= {screenStyles.anonymousLogin}
            title='Login anonymously'
            onPress={() => anonymousLoginClicked()}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  componentDidMount() {
    if(firebaseAuth.currentUser) this.props.navigation.navigate('Home')
  }

  componentWillUnmount() {
  }

  onLoginPress() {
    firebaseAuth.signInAnonymously().then((credentials) => reactotron.logImportant('log in successful', credentials), (error) => reactotron.logImportant(error))
    // this.props.navigation.navigate('Home')
  }
}

const screenStyles = StyleSheet.create({
  anonymousLogin: {
    marginVertical: 16
  }
})

const usernameChanged = (usernameText) => {
  username = usernameText
}

const passwordChanged = (passwordText) => {
  password = passwordText
}

const anonymousLoginClicked = () => {

}