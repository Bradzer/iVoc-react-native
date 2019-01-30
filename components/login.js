import React, { Component } from "react";

import styles from "./style";
import {Keyboard, Text, View, TextInput, TouchableWithoutFeedback, StyleSheet, KeyboardAvoidingView, ToastAndroid, } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from 'react-native-firebase'
import reactotron from "../ReactotronConfig";

const firebaseAuth = firebase.auth()
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
              onPress={() => this.anonymousLoginClicked()}
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
    if(username && password) {
      firebaseAuth.createUserWithEmailAndPassword(username, password)
      .then((credentials) => {
        onLoginSuccessful(credentials)
        this.props.navigation.navigate('Home')
      }, 
      (createUserError) => {
        if(createUserError.code === 'auth/email-already-in-use') {
          firebaseAuth.signInWithEmailAndPassword(username, password)
          .then(credentials => {
            ToastAndroid.show('login successful', ToastAndroid.SHORT)
            this.props.navigation.navigate('Home')    
          },
          (signInError) => ToastAndroid.show(signInError.code, ToastAndroid.SHORT))
        }
        else {
          ToastAndroid.show(createUserError.code, ToastAndroid.SHORT)
        }
      })  
    }
    else {
      ToastAndroid.show('Please enter account details', ToastAndroid.SHORT)
    }
  }

  anonymousLoginClicked = () => {
    firebaseAuth.signInAnonymously()
    .then((credentials) => {
      reactotron.logImportant('anonymous log in successful', credentials)
      usersCollection.add({
        uid: credentials.user.uid, 
        email: credentials.user.email, 
        password: null, 
        isAnonymous: credentials.user.isAnonymous, 
        providerId: credentials.user.providerId
      })
      .then(docRef => docRef.update({id: docRef.id}))
      ToastAndroid.show('login successful', ToastAndroid.SHORT)
      this.props.navigation.navigate('Home')
    }, 
    (error) => ToastAndroid.show(error.code, ToastAndroid.SHORT))
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

const onLoginSuccessful = (credentials) => {
  reactotron.logImportant('email log in successful', credentials)
  usersCollection.add({
    uid: credentials.user.uid, 
    email: credentials.user.email, 
    password: password, 
    isAnonymous: credentials.user.isAnonymous, 
    providerId: credentials.user.providerId
  })
  .then(docRef => docRef.update({id: docRef.id}))
  ToastAndroid.show('login successful', ToastAndroid.SHORT)
}