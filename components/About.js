import React from 'react';
import { StyleSheet, ScrollView, View, Text, BackHandler, ToastAndroid, Linking } from 'react-native';
import { Button, } from 'react-native-elements'
import { StackActions } from 'react-navigation'

import AppConstants from '../Constants'
import AppInfo from '../AppInfo'
import ThanksList from '../ThanksList'

class About extends React.Component {

    _didFocusSubscription = null;
    _willBlurSubscription = null;

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
                        <Text style={{marginTop: 16, fontWeight: 'bold', fontSize: 18}}>{AppConstants.APP_NAME}</Text>
                        <Text style={{fontSize: 18}}>version {AppConstants.APP_VERSION}</Text>
                        { AppInfo.INFO_ARRAY.map((element, index, array) => {
                        if(index % 2 === 0)
                        return (
                            <Text key={index} style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{element}</Text>
                        )
                        else return (
                            <Text key={index} style={{fontSize: 18}}>{element}</Text>
                        )
                        })}
                        <Button title={AppConstants.STRING_USED_LIBRARIES} containerStyle={{marginTop: 16}} onPress={this.showLibrariesPressed}/>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_BIG_THANKS}</Text>
                        {ThanksList.THANKSLIST_ARRAY.map((element, index, array) => {
                            return <Text key={index} style={{fontSize: 18}}>{element}</Text>
                        })}
                    </View>
                    )
                    :
                    (
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_AXIOS}</Text>
                        <Text style={{fontSize: 18}} onPress={() => this.onUrlPressed(AppConstants.STRING_AXIOS_LINK)}>{AppConstants.STRING_AXIOS_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_MOBX}</Text>
                        <Text style={{fontSize: 18}} onPress={() => this.onUrlPressed(AppConstants.STRING_MOBX_LINK)}>{AppConstants.STRING_MOBX_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_ANIMATABLE}</Text>
                        <Text style={{fontSize: 18}} onPress={() => this.onUrlPressed(AppConstants.STRING_REACT_NATIVE_ANIMATABLE_LINK)}>{AppConstants.STRING_REACT_NATIVE_ANIMATABLE_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_ELEMENTS}</Text>
                        <Text style={{fontSize: 18}} onPress={() => this.onUrlPressed(AppConstants.STRING_REACT_NATIVE_ELEMENTS_LINK)}>{AppConstants.STRING_REACT_NATIVE_ELEMENTS_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_FIREBASE}</Text>
                        <Text style={{fontSize: 18}} onPress={() => this.onUrlPressed(AppConstants.STRING_REACT_NATIVE_FIREBASE_LINK)}>{AppConstants.STRING_REACT_NATIVE_FIREBASE_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_INDICATORS}</Text>
                        <Text style={{fontSize: 18}} onPress={() => this.onUrlPressed(AppConstants.STRING_REACT_NATIVE_INDICATORS_LINK)}>{AppConstants.STRING_REACT_NATIVE_INDICATORS_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_POPUP_MENU}</Text>
                        <Text style={{fontSize: 18}} onPress={() => this.onUrlPressed(AppConstants.STRING_REACT_NATIVE_POPUP_MENU_LINK)}>{AppConstants.STRING_REACT_NATIVE_POPUP_MENU_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_SNACKBAR}</Text>
                        <Text style={{fontSize: 18}} onPress={() => this.onUrlPressed(AppConstants.STRING_REACT_NATIVE_SNACKBAR_LINK)}>{AppConstants.STRING_REACT_NATIVE_SNACKBAR_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_VECTOR_ICONS}</Text>
                        <Text style={{fontSize: 18}} onPress={() => this.onUrlPressed(AppConstants.STRING_REACT_NATIVE_VECTOR_ICONS_LINK)}>{AppConstants.STRING_REACT_NATIVE_VECTOR_ICONS_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NAVIGATION}</Text>
                        <Text style={{fontSize: 18}} onPress={() => this.onUrlPressed(AppConstants.STRING_REACT_NAVIGATION_LINK)}>{AppConstants.STRING_REACT_NAVIGATION_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REALM}</Text>
                        <Text style={{fontSize: 18}} onPress={() => this.onUrlPressed(AppConstants.STRING_REALM_LINK)}>{AppConstants.STRING_REALM_LINK}</Text>
                    </View>
                    )}
                </ScrollView>
            </View>
        )
    }

    componentDidMount() {
        this._didFocusSubscription = this.props.navigation.addListener("didFocus", () => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
          });

        this._willBlurSubscription = this.props.navigation.addListener('willBlur', () =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    componentWillUnmount() {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
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

export default About

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
    },
})

