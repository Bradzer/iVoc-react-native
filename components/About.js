import React from 'react';
import { StyleSheet, ScrollView, View, Text, BackHandler } from 'react-native';
import { Button, } from 'react-native-elements'

import AppConstants from '../Constants'

class About extends React.Component {

    _didFocusSubscription = null;
    _willBlurSubscription = null;

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
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_DEVELOPER}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_DEVELOPER_NAME}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_EMAIL}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_EMAIL_VALUE}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_PROJECT_REPO}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_PROJECT_REPO_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_DEVELOPER_GITHUB}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_DEVELOPER_GITHUB_LINK}</Text>
                        <Button title={AppConstants.STRING_USED_LIBRARIES} containerStyle={{marginTop: 16}} onPress={this.showLibrariesPressed}/>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_BIG_THANKS}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_AMIROL}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_KONRAD}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_ROLAND}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_STEEVE}</Text>
                    </View>
                    )
                    :
                    (
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_AXIOS}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_AXIOS_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_MOBX}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_MOBX_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_ELEMENTS}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_ELEMENTS_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_FIREBASE}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_FIREBASE_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_INDICATORS}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_INDICATORS_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_POPUP_MENU}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_POPUP_MENU_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_VECTOR_ICONS}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_REACT_NATIVE_VECTOR_ICONS_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REACT_NAVIGATION}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_REACT_NAVIGATION_LINK}</Text>
                        <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_REALM}</Text>
                        <Text style={{fontSize: 18}}>{AppConstants.STRING_REALM_LINK}</Text>
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
          return false;
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

