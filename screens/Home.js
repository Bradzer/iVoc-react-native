/* eslint-disable react/prop-types */
/* global setTimeout clearTimeout */

import React from 'react';
import { StyleSheet, View, BackHandler, ToastAndroid, } from 'react-native';
import { Button, } from 'react-native-elements'
import firebase from 'react-native-firebase'
import { inject, observer } from 'mobx-react'
import { autorun } from 'mobx'
import { NavigationEvents } from 'react-navigation';

import HomeOverflowMenu from '../fragments/HomeOverflowMenu'
import AppConstants from '../constants/Constants'
import reactotron from '../ReactotronConfig';

const firebaseAuth = firebase.auth()
let userId = null
const blackListCollection = firebase.firestore().collection('blacklist')

class Home extends React.Component {

    store = this.props.store

    myAutorun = autorun(() => {
    })

    timer = null;

    _authStateListener = null;

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: AppConstants.APP_NAME,
            headerStyle: {
                backgroundColor: AppConstants.APP_PRIMARY_COLOR
              },
              headerTintColor: AppConstants.COLOR_WHITE,
              headerRight: <HomeOverflowMenu navigation={navigation} />
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <NavigationEvents
                    onDidFocus={() => this.onDidFocus()}
                    onWillBlur={() => this.onWillBlur()}
                />
                <View style={styles.buttonGroup}>
                    <Button 
                        raised 
                        titleStyle={{ fontSize: 24}} 
                        buttonStyle={{maxWidth: 250}} 
                        containerStyle={{marginVertical: 16}} 
                        title={AppConstants.STRING_START_RANDOM_PRACTICE}
                        onPress={this.navigateToRandomPractice}
                        />
                    <Button 
                    raised
                    titleStyle={{ fontSize: 24}} 
                    buttonStyle={{maxWidth: 250}} 
                    title={AppConstants.STRING_REVIEW_MY_VOCABULARY}
                    onPress={this.navigateToReviewVocabulary}
                    />
                </View>
            </View>
        )
    }

    componentDidMount() {

        this._authStateListener = firebase.auth().onAuthStateChanged((user) => {
            if(!user) {
                this.props.navigation.navigate('LoginScreen')
            }
        })
        userId = firebaseAuth.currentUser.uid

    }

    onDidFocus = () => {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        this.manageAccountStatus()
    }

    onWillBlur = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    }

    manageAccountStatus = () => {
        blackListCollection.where('id', '==', userId).get()
        .then((querySnapshot) => {
            if(!querySnapshot.empty) signOut()
        },
        () => ToastAndroid.show(AppConstants.TOAST_ERROR, ToastAndroid.SHORT))
    }

    navigateToRandomPractice = () => this.props.navigation.navigate('RandomPractice')

    navigateToReviewVocabulary = () => this.props.navigation.navigate('ReviewVocabulary')

    onBackButtonPressAndroid = () => {
        if(this.store.isHomeMenuOpen) {
            this.store.setCloseHomeMenu(true)
            return true
        }
        else if (firebase.auth().currentUser) {
            this.onAppLeavingSequence()
            return true;
        } else return false;
      };

      onAppLeavingSequence = () => {
          if(!this.timer) {
              ToastAndroid.show(AppConstants.TOAST_EXIT_APP, ToastAndroid.SHORT)
              this.timer = setTimeout(() => {
                  clearTimeout(this.timer)
                  this.timer = null
                }, 2000)
          } else BackHandler.exitApp()  
      }
    
    componentWillUnmount() {
        this._authStateListener()
        this.myAutorun()
    }
}

export default inject('store')(observer(Home))

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    buttonGroup: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

function signOut() {
    firebaseAuth.signOut()
}