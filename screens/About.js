import React from 'react';
import { StyleSheet, ScrollView, View, Text, ToastAndroid } from 'react-native';
import { Button, } from 'react-native-elements'
import { NavigationEvents } from 'react-navigation'
import PropTypes from 'prop-types';

import firebase from 'react-native-firebase'

import AppConstants from '../constants/Constants'
import Strings from '../constants/Strings'
import Toasts from '../constants/Toasts'
import AppInfo from '../constants/AppInfo'
import ThanksList from '../constants/ThanksList'
import BanTypes from '../constants/BanTypes'
import reactotron from '../ReactotronConfig';

const firebaseAuth = firebase.auth()
let userId = null
const blackListCollection = firebase.firestore().collection('blacklist')

class About extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: Strings.STRING_ABOUT,
            headerStyle: {
                backgroundColor: AppConstants.APP_PRIMARY_COLOR
              },
              headerTintColor: AppConstants.COLOR_WHITE,
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
                        <NavigationEvents
                            onDidFocus={() => this.onDidFocus()}
                            onWillBlur={() => this.onWillBlur()}
                        />
                        <Text style={{marginTop: 16, fontWeight: 'bold', fontSize: 18}}>{AppConstants.APP_NAME}</Text>
                        <Text style={{fontSize: 18}}>version {AppConstants.APP_VERSION}</Text>
                        <Text style={{fontSize: 18}}>{Strings.STRING_POWERED_BY}</Text>
                        { AppInfo.INFO_ARRAY.map((element, index, array) => {
                        if(index % 2 === 0)
                        return (
                            <Text key={index} style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{element}</Text>
                        )
                        else if(index !== 5 && index !== 7 )
                            return (
                                <Text key={index} style={{fontSize: 18}}>{element}</Text>
                            )
                            else
                                return <Text key={index} style={{fontSize: 18}} onPress={() => this.onUrlPressed(element)}>{element}</Text>
                        })}
                        <Button title={Strings.STRING_USED_LIBRARIES} containerStyle={{marginTop: 16}} onPress={this.showLibrariesPressed}/>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{Strings.STRING_BIG_THANKS}</Text>
                        {ThanksList.THANKSLIST_ARRAY.map((element, index, array) => {
                            return <Text key={index} style={{fontSize: 18}}>{element}</Text>
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

    showLibrariesPressed = () => {
        this.props.navigation.navigate('UsedLibraries')
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

About.propTypes = {
    navigation: PropTypes.object.isRequired,
}

function signOut() {
    firebaseAuth.signOut()
}