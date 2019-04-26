import React, { Component } from "react";
import {
  Keyboard,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  KeyboardAvoidingView,
  ToastAndroid,
  Dimensions,
  ScrollView } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import firebase from 'react-native-firebase'

import styles from "./style";
import AppConstants from '../Constants'

const firebaseAuth = firebase.auth()
const usersCollection = firebase.firestore().collection('users')

export default class LoginScreen extends Component {

  state ={
    displayComponent: 'none',
    signUpChecked: false,
    loginButtonTitle: AppConstants.STRING_LOG_IN,
    paddingTop: undefined,
    username: '',
    password: '',
    confirmPassword: '',
  }

  focusPasswordInput = () => {
    this._passwordInput.focus()
  }

  focusConfirmPasswordInput = () => {
    this._confirmPasswordInput.focus()
  }

  render() {
    return (
      <View style={[screenStyles.container, {display: this.state.displayComponent}]}>
        <ScrollView style={{flex: 1}} contentContainerStyle={{paddingTop: this.state.paddingTop}}>
          <KeyboardAvoidingView style={styles.containerView} behavior="padding" onLayout={this.onLayout}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.loginScreenContainer}>
              <Text style={styles.logoText}>{AppConstants.APP_NAME}</Text>
                <TextInput
                  ref={component => this._email = component}
                  placeholder="E-mail"
                  placeholderColor="#c4c3cb"
                  style={styles.loginFormTextInput}
                  returnKeyType='next'
                  onSubmitEditing={this.focusPasswordInput}
                  onChangeText={(username) => this.setState({username})}
                  value={this.state.username}
                  textContentType="emailAddress"
                />
                <TextInput
                  ref={component => this._passwordInput = component}
                  placeholder="Password"
                  placeholderColor="#c4c3cb"
                  returnKeyType={this.state.signUpChecked ? 'next' : 'go'}
                  onSubmitEditing={this.onPasswordSubmitted}
                  style={styles.loginFormTextInput}
                  secureTextEntry
                  onChangeText={(password) => this.setState({password})}
                  textContentType={this.state.signUpChecked ? 'newPassword' : 'password'}
                />
                <TextInput
                  ref={component => this._confirmPasswordInput = component}
                  placeholder="Confirm password"
                  placeholderColor="#c4c3cb"
                  returnKeyType='go'
                  onSubmitEditing={this.onConfirmPasswordSubmitted}
                  style={this.state.signUpChecked ? styles.loginFormTextInput : styles.hideLoginFormTextInput}
                  secureTextEntry
                  onChangeText={(confirmPassword) => this.setState({confirmPassword})}
                  textContentType={this.state.signUpChecked ? 'newPassword' : 'password'}
                />
                <Button
                  buttonStyle={styles.loginButton}
                  containerStyle={{marginHorizontal: 8}}
                  onPress={this.onLoginPress}
                  title={this.state.signUpChecked ? AppConstants.STRING_SIGN_UP : AppConstants.STRING_LOG_IN}
                />
                <Button
                  containerStyle={screenStyles.anonymousLogin}
                  title={AppConstants.STRING_LOGIN_ANONYMOUSLY}
                  onPress={this.anonymousLoginClicked}
                />
                <CheckBox
                  title= {AppConstants.STRING_SIGN_UP}
                  containerStyle={[screenStyles.signUpChkBx, {borderWidth: 0,}]}
                  checked={this.state.signUpChecked}
                  onPress={() => this.signUpPressed(this.state.signUpChecked)}
                />
            </View>
          </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }

  onLayout = (event) => {
    if(this.state.marginTop) return
    let { height } = event.nativeEvent.layout
    let parentHeight = Dimensions.get('window').height
    let paddingTop = (parentHeight - height)/2
    this.setState({paddingTop})
  }

  componentDidMount() {
    if(firebaseAuth.currentUser) this.props.navigation.navigate(AppConstants.STRING_HOME)
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
      if(this.state.username && this.state.password) {
        firebaseAuth.signInWithEmailAndPassword(this.state.username, this.state.password)
        .then((credentials) => {
          onLoginSuccessful(credentials)
          this.props.navigation.navigate(AppConstants.STRING_HOME)
        },
        (createUserError) => ToastAndroid.show(createUserError.code, ToastAndroid.SHORT))
      }
    }
    else {
      if(this.state.username && this.state.password && this.state.confirmPassword)
        if(this.state.password === this.state.confirmPassword) {
          firebaseAuth.createUserWithEmailAndPassword(this.state.username, this.state.password)
          .then(() => {
            ToastAndroid.show(AppConstants.TOAST_LOG_IN_SUCCESS, ToastAndroid.SHORT)
            this.props.navigation.navigate(AppConstants.STRING_HOME)
          },
          (signInError) => ToastAndroid.show(signInError.code, ToastAndroid.SHORT))
        }
        else {
          ToastAndroid.show(AppConstants.TOAST_PASSES_DONT_MATCH, ToastAndroid.SHORT)
          ToastAndroid.show(AppConstants.TOAST_ENTER_SAME_PASS, ToastAndroid.SHORT)
        }
    }
  }

  anonymousLoginClicked = () => {
    firebaseAuth.signInAnonymously()
    .then((credentials) => {
      usersCollection.add({
        uid: credentials.user.uid,
        email: credentials.user.email,
        password: null,
        isAnonymous: credentials.user.isAnonymous,
        providerId: credentials.user.providerId
      })
      .then(docRef => docRef.update({id: docRef.id}))
      ToastAndroid.show(AppConstants.TOAST_LOG_IN_SUCCESS, ToastAndroid.SHORT)
      this.props.navigation.navigate(AppConstants.STRING_HOME)
    },
    (error) => ToastAndroid.show(error.code, ToastAndroid.SHORT))
  }

  onPasswordSubmitted = () => {
    if(this.state.signUpChecked) this.focusConfirmPasswordInput()
    else this.onLoginPress()
  }

  onConfirmPasswordSubmitted = () => {
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

const onLoginSuccessful = (credentials) => {
  usersCollection.add({
    uid: credentials.user.uid,
    email: credentials.user.email,
    isAnonymous: credentials.user.isAnonymous,
    providerId: credentials.user.providerId
  })
  .then(docRef => docRef.update({id: docRef.id}))
  ToastAndroid.show(AppConstants.TOAST_LOG_IN_SUCCESS, ToastAndroid.SHORT)
}
