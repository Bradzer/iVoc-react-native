import React, { Component } from "react";

import styles from "./style";
import {Keyboard, Text, View, TextInput, TouchableWithoutFeedback, StyleSheet, KeyboardAvoidingView} from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase'
import reactotron from "../ReactotronConfig";

// const appId = "1047121222092614"

const firebaseAuth = firebase.auth()
const wordsDetailsCollection = firebase.firestore().collection('wordsDetails')
const usersCollection = firebase.firestore().collection('users')


let username = ''
let password = ''

export default class LoginScreen extends Component {

  state = {
    displayComponent: 'none'
  }
  render() {
    return (
      <View style={[screenStyles.container, {display: this.state.displayComponent}]}>
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
      </View>
    );
  }

  componentDidMount() {
    if(firebaseAuth.currentUser) this.props.navigation.navigate('Home')
    else this.setState({displayComponent: 'flex'})
  }

  onLoginPress() {
    firebaseAuth.createUserWithEmailAndPassword(username, password)
    .then((credentials) => {
      reactotron.logImportant('email log in successful', credentials)
      usersCollection.add({uid: credentials.user.uid, email: credentials.user.email, password: password, isAnonymous: credentials.user.isAnonymous, providerId: credentials.user.providerId}).then(docRef => docRef.update({id: docRef.id}))
      this.props.navigation.navigate('Home')
    }, 
    (error) => reactotron.logImportant(error))
  }
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  firebaseAuth.signInAnonymously()
  .then((credentials) => {
    reactotron.logImportant('anonymous log in successful', credentials)
    usersCollection.add({uid: credentials.user.uid, email: credentials.user.email, password: null, isAnonymous: credentials.user.isAnonymous, providerId: credentials.user.providerId}).then(docRef => docRef.update({id: docRef.id}))
    this.props.navigation.navigate('Home')
  }, 
  (error) => reactotron.logImportant(error))
}