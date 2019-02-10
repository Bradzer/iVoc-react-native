import React, { Component } from "react";

import styles from "./style";
import {Keyboard, Text, View, TextInput, TouchableWithoutFeedback, StyleSheet, KeyboardAvoidingView, ToastAndroid, } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import firebase from 'react-native-firebase'
import reactotron from "../ReactotronConfig";

const firebaseAuth = firebase.auth()
const usersCollection = firebase.firestore().collection('users')

let username = ''
let password = ''
let confirmPassword = ''

export default class LoginScreen extends Component {

  state = {
    displayComponent: 'none',
    signUpChecked: false,
    loginButtonTitle: 'Login'
  }

  render() {
    return (
      <View style={[screenStyles.container, {display: this.state.displayComponent}]}>
        <KeyboardAvoidingView style={styles.containerView} behavior="padding">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginScreenContainer}>
            <View style={styles.loginFormView}>
            <Text style={styles.logoText}>iVoc</Text>
              <TextInput ref={component => this._email = component} placeholder="E-mail" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} returnKeyType='next' onSubmitEditing={(event) => this.focusPasswordInput()} onChangeText={(usernameText) => usernameChanged(usernameText)}/>
              <TextInput ref={component => this._passwordInput = component} placeholder="Password" placeholderColor="#c4c3cb" returnKeyType={this.state.signUpChecked ? 'next' : 'go'} onSubmitEditing={(event) => this.onPasswordSubmitted()}style={styles.loginFormTextInput} secureTextEntry={true} onChangeText={(passwordText) => passwordChanged(passwordText)}/>
              <TextInput ref={component => this._confirmPasswordInput = component} placeholder="Confirm password" placeholderColor="#c4c3cb" returnKeyType='go' onSubmitEditing={(event) => this.onConfirmPasswordSubmitted()} style={this.state.signUpChecked ? styles.loginFormTextInput : styles.hideLoginFormTextInput} secureTextEntry={true} onChangeText={(confirmPasswordText) => confirmPasswordChanged(confirmPasswordText)}/>
              <Button
                buttonStyle={styles.loginButton}
                containerStyle={{marginHorizontal: 8}}
                onPress={() => this.onLoginPress()}
                title={this.state.signUpChecked ? 'Sign up' : "Login"}
              />
              <Button 
              containerStyle= {screenStyles.anonymousLogin}
              title='Login anonymously'
              onPress={() => this.anonymousLoginClicked()}
              />
              <CheckBox
                title= 'Sign up'
                containerStyle= {[screenStyles.signUpChkBx, {borderWidth: 0,}]}
                checked= {this.state.signUpChecked}
                onPress= {() => this.signUpPressed(this.state.signUpChecked)}
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

  signUpPressed(currentStatus) {
    this.setState({ signUpChecked: !currentStatus})
    this._email.focus()
    this._email.blur()
    this._passwordInput.blur()
    this._confirmPasswordInput.blur()
  }
  onLoginPress() {
    if(!this.state.signUpChecked) {
      if(username && password) {
        firebaseAuth.signInWithEmailAndPassword(username, password)
        .then((credentials) => {
          onLoginSuccessful(credentials)
          this.props.navigation.navigate('Home')
        },
        (createUserError) => ToastAndroid.show(createUserError.code, ToastAndroid.SHORT))
      }  
    }
    else {
      if(username && password && confirmPassword)
        if(password === confirmPassword) {
          firebaseAuth.createUserWithEmailAndPassword(username, password)
          .then(credentials => {
            ToastAndroid.show('login successful', ToastAndroid.SHORT)
            this.props.navigation.navigate('Home')    
          },
          (signInError) => ToastAndroid.show(signInError.code, ToastAndroid.SHORT))
        }
        else {
          ToastAndroid.show("Both passwords don't match", ToastAndroid.SHORT)
          ToastAndroid.show("Please enter same the password", ToastAndroid.SHORT)
        }
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

  onPasswordSubmitted = (event) => {
    if(this.state.signUpChecked) this.focusConfirmPasswordInput()
    else this.onLoginPress()
  }
  onConfirmPasswordSubmitted = (event) => {
    this.onLoginPress()
  }
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  anonymousLogin: {
    marginTop: 16,
    marginHorizontal: 8
  },
  signUpChkBx: {
    alignSelf: 'center'
  }
})

const usernameChanged = (usernameText) => {
  username = usernameText
}

const passwordChanged = (passwordText) => {
  password = passwordText
}

const confirmPasswordChanged = (confirmPasswordText) => {
  confirmPassword = confirmPasswordText
}

const onLoginSuccessful = (credentials) => {
  reactotron.logImportant('email log in successful', credentials)
  usersCollection.add({
    uid: credentials.user.uid, 
    email: credentials.user.email, 
    isAnonymous: credentials.user.isAnonymous, 
    providerId: credentials.user.providerId
  })
  .then(docRef => docRef.update({id: docRef.id}))
  ToastAndroid.show('login successful', ToastAndroid.SHORT)
}