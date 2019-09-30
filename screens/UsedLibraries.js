import React from 'react';
import { StyleSheet, View, Text, ToastAndroid, Linking } from 'react-native';
import { StackActions, NavigationEvents } from 'react-navigation'
import firebase from 'react-native-firebase'

import AppConstants from '../constants/Constants'
import UsedLibrariesList from '../constants/UsedLibrariesList'
import BanTypes from '../constants/BanTypes'
import reactotron from '../ReactotronConfig';

const firebaseAuth = firebase.auth()
let userId = null
const blackListCollection = firebase.firestore().collection('blacklist')

class UsedLibraries extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: AppConstants.STRING_ABOUT,
            headerStyle: {
                backgroundColor: AppConstants.APP_PRIMARY_COLOR
              },
              headerTintColor: AppConstants.COLOR_WHITE,
            }
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                <NavigationEvents
                    onDidFocus={() => this.onDidFocus()}
                    onWillBlur={() => this.onWillBlur()}
                />
                {UsedLibrariesList.LIBRARIES_ARRAY.map((element, index, array) => {
                    if(index % 2 === 0)
                        return <Text key={index} style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{element}</Text>
                    else
                        return <Text key={index} style={{fontSize: 18}} onPress={() => this.onUrlPressed(element)}>{element}</Text>
                })}
            </View>
        )
    }

    componentDidMount() {
        userId = firebaseAuth.currentUser.uid
    }

    componentWillUnmount() {
    }

	onDidFocus = () => {
        this.manageAccountStatus()
        // BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    }

    onWillBlur = () => {
        // BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    }

    manageAccountStatus = () => {
        reactotron.log('manageAccountStatus')
        blackListCollection.where('id', '==', userId).get()
        .then((querySnapshot) => {
            if(!querySnapshot.empty) {
                signOut()
                querySnapshot.forEach((docSnapshot) => {
                    switch(docSnapshot.data().banType) {
                        case BanTypes.DELETED:
                            ToastAndroid.show(AppConstants.TOAST_ACCOUNT_DELETED, ToastAndroid.SHORT)
                            break;

                        case BanTypes.DISABLED:
                            ToastAndroid.show(AppConstants.TOAST_ACCOUNT_DISABLED, ToastAndroid.SHORT)
                            break;
                    }
                })
            }
        },
        () => ToastAndroid.show(AppConstants.TOAST_ERROR, ToastAndroid.SHORT))
    }

    onUrlPressed = (url) => {
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    ToastAndroid.show("No app installed to handle url", ToastAndroid.SHORT)
                } else {
                return Linking.openURL(url);
                }
            })
            .catch(() => ToastAndroid.show(AppConstants.TOAST_ERROR, ToastAndroid.SHORT));
    }
}

export default UsedLibraries

function signOut() {
    firebaseAuth.signOut()
}