import React from 'react';
import { StyleSheet, View, BackHandler, } from 'react-native';
import { Button, Icon } from 'react-native-elements'
import firebase from 'react-native-firebase'

import {HomeOverflowMenu} from './OverflowMenu'
import AppConstants from '../Constants'

export default class Home extends React.Component {

    _didFocusSubscription = null;
    _willBlurSubscription = null;
    _authStateListener = null;

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: AppConstants.APP_NAME,
            headerStyle: {
                backgroundColor: AppConstants.APP_PRIMARY_COLOR
              },
              headerTintColor: AppConstants.COLOR_WHITE,
              headerRight: <HomeOverflowMenu navigation={navigation} />        }
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.buttonGroup}>
                    <Button 
                        raised 
                        titleStyle={{ fontSize: 24}} 
                        buttonStyle={{maxWidth: 250}} 
                        containerStyle={{marginVertical: 16}} 
                        title={AppConstants.STRING_START_RANDOM_PRACTICE}
                        onPress={() => this.props.navigation.navigate('RandomPractice')}
                        />
                    <Button 
                    titleStyle={{ fontSize: 24}} 
                    buttonStyle={{maxWidth: 250}} 
                    title={AppConstants.STRING_REVIEW_MY_VOCABULARY}
                    onPress={() => this.props.navigation.navigate('ReviewVocabulary')}
                    />
                </View>
            </View>
        )
    }

    componentDidMount() {

        this._didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        });

        this._willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );

        this._authStateListener = firebase.auth().onAuthStateChanged((user) => {
            if(!user) {
                this.props.navigation.navigate('LoginScreen')
            }
        })
    }

    onBackButtonPressAndroid = () => {
        if (firebase.auth().currentUser) {
          return true;
        } else {
          return false;
        }
      };
    
    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
        this._authStateListener()
    }
}

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