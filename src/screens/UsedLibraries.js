import React from 'react';
import { StyleSheet, View, Text, ScrollView, ToastAndroid, Linking } from 'react-native';
import { NavigationEvents } from 'react-navigation'
import firebase from 'react-native-firebase'

import Strings from '../constants/Strings'
import Toasts from '../constants/Toasts'
import UsedLibrariesList from '../constants/UsedLibrariesList'
import BanTypes from '../constants/BanTypes'
import reactotron from '../../ReactotronConfig';

const firebaseAuth = firebase.auth()
let userId = null
const blackListCollection = firebase.firestore().collection('blacklist')

class UsedLibraries extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: Strings.STRING_LIBRARIES,
            }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onDidFocus={() => this.onDidFocus()}
                    onWillBlur={() => this.onWillBlur()}
                />
                <ScrollView style={{flex: 1}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        {UsedLibrariesList.LIBRARIES_ARRAY.map((element, index, array) => {
                            if(index % 2 === 0)
                                return <Text key={index} style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{element}</Text>
                            else
                                return <Text key={index} style={{fontSize: 18}} onPress={() => this.onUrlPressed(element)}>{element}</Text>
                        })}
                    </View>
                </ScrollView>
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
    }

    onWillBlur = () => {
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
                            ToastAndroid.show(Toasts.TOAST_ACCOUNT_DELETED, ToastAndroid.SHORT)
                            break;

                        case BanTypes.DISABLED:
                            ToastAndroid.show(Toasts.TOAST_ACCOUNT_DISABLED, ToastAndroid.SHORT)
                            break;
                    }
                })
            }
        },
        () => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))
    }

    onUrlPressed = (url) => {
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    ToastAndroid.show(Toasts.TOAST_NO_APP_FOR_URL, ToastAndroid.SHORT)
                } else {
                return Linking.openURL(url);
                }
            })
            .catch(() => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT));
    }
}

export default UsedLibraries

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
    },
})

function signOut() {
    firebaseAuth.signOut()
}