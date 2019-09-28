import React from 'react';
import { StyleSheet, ScrollView, View, Text, BackHandler, ToastAndroid } from 'react-native';
import { StackActions, NavigationEvents } from 'react-navigation'

import firebase from 'react-native-firebase'

import AboutFragment from '../fragments/AboutFragment'
import AppConstants from '../constants/Constants'
import UsedLibrariesList from '../constants/UsedLibrariesList'
import BanTypes from '../constants/BanTypes'
import reactotron from '../ReactotronConfig';

const firebaseAuth = firebase.auth()
let userId = null
const blackListCollection = firebase.firestore().collection('blacklist')

class About extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: AppConstants.STRING_ABOUT,
            headerStyle: {
                backgroundColor: AppConstants.APP_PRIMARY_COLOR
              },
              headerTintColor: AppConstants.COLOR_WHITE,
            }
    }

    state = {
        displayLibraries: false
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{flex: 1}}>
                    {this.state.displayLibraries === false
                    ?
                    (
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <NavigationEvents
                            onDidFocus={() => this.onDidFocus()}
                            onWillBlur={() => this.onWillBlur()}
                        />
                        <AboutFragment onShowLibrariesPressed={this.showLibrariesPressed}/>
                    </View>
                    )
                    :
                    (
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
                    )}
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
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    }

    onWillBlur = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
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

    onBackButtonPressAndroid = () => {
        if (this.state.displayLibraries) {
            this.setState({displayLibraries: false})
            return true;
        } else {
            StackActions.pop()
        }
      };

    showLibrariesPressed = () => {
        this.setState({displayLibraries: true})
    }
}

export default About

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