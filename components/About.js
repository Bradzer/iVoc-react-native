import React from 'react';
import { StyleSheet, ScrollView, View, Text, BackHandler } from 'react-native';
import { Button, } from 'react-native-elements'
import { NavigationEvents } from 'react-navigation'

import AppConstants from '../Constants'

export default class About extends React.Component {
    static navigationOptions = {
        headerTitle: AppConstants.STRING_ABOUT,
        headerStyle: {
            backgroundColor: AppConstants.APP_PRIMARY_COLOR
        },
        headerTintColor: AppConstants.COLOR_WHITE,
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{flex: 1}}>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        {this.displayLibraries ? this.renderLibraries() : this.renderAbout()}
                    </View>
                </ScrollView>
                <NavigationEvents
                    onDidFocus={() => BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)}
                    onWillBlur={() => BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)}
                />
            </View>
        )
    }

    renderAbout() {
        return (
            <React.Fragment>
                <Label style={{textDecorationLine: 'none'}}>{AppConstants.APP_NAME}</Label>
                <Value>version {AppConstants.APP_VERSION}</Value>
                <Label>{AppConstants.STRING_DEVELOPER}</Label>
                <Value>{AppConstants.STRING_DEVELOPER_NAME}</Value>
                <Label>{AppConstants.STRING_EMAIL}</Label>
                <Value>{AppConstants.STRING_EMAIL_VALUE}</Value>
                <Label>{AppConstants.STRING_PROJECT_REPO}</Label>
                <Value>{AppConstants.STRING_PROJECT_REPO_LINK}</Value>
                <Label>{AppConstants.STRING_DEVELOPER_GITHUB}</Label>
                <Value>{AppConstants.STRING_DEVELOPER_GITHUB_LINK}</Value>
                <Button title={AppConstants.STRING_USED_LIBRARIES} containerStyle={{marginTop: 16}} onPress={this.showLibrariesPressed}/>
                <Label>{AppConstants.STRING_BIG_THANKS}</Label>
                <Value>{AppConstants.STRING_AMIROL}</Value>
                <Value>{AppConstants.STRING_KONRAD}</Value>
                <Value>{AppConstants.STRING_ROLAND}</Value>
                <Value>{AppConstants.STRING_STEEVE}</Value>
                <Value>{AppConstants.STRING_BICAS}</Value>
            </React.Fragment>
        )
    }

    renderLibraries() {
        return (
            <React.Fragment>
                <Label>{AppConstants.STRING_AXIOS}</Label>
                <Value>{AppConstants.STRING_AXIOS_LINK}</Value>
                <Label>{AppConstants.STRING_MOBX}</Label>
                <Value>{AppConstants.STRING_MOBX_LINK}</Value>
                <Label>{AppConstants.STRING_REACT_NATIVE_ELEMENTS}</Label>
                <Value>{AppConstants.STRING_REACT_NATIVE_ELEMENTS_LINK}</Value>
                <Label>{AppConstants.STRING_REACT_NATIVE_FIREBASE}</Label>
                <Value>{AppConstants.STRING_REACT_NATIVE_FIREBASE_LINK}</Value>
                <Label>{AppConstants.STRING_REACT_NATIVE_INDICATORS}</Label>
                <Value>{AppConstants.STRING_REACT_NATIVE_INDICATORS_LINK}</Value>
                <Label>{AppConstants.STRING_REACT_NATIVE_POPUP_MENU}</Label>
                <Value>{AppConstants.STRING_REACT_NATIVE_POPUP_MENU_LINK}</Value>
                <Label>{AppConstants.STRING_REACT_NATIVE_VECTOR_ICONS}</Label>
                <Value>{AppConstants.STRING_REACT_NATIVE_VECTOR_ICONS_LINK}</Value>
                <Label>{AppConstants.STRING_REACT_NAVIGATION}</Label>
                <Value>{AppConstants.STRING_REACT_NAVIGATION_LINK}</Value>
                <Label>{AppConstants.STRING_REALM}</Label>
                <Value>{AppConstants.STRING_REALM_LINK}</Value>
            </React.Fragment>
        )
    }

    onBackButtonPressAndroid = () => {
        if (this.displayLibraries) {
            this.props.navigation.setParams({displayLibraries: false})
        } else {
            this.props.navigation.pop()
        }
    };

    showLibrariesPressed = () => {
        this.props.navigation.setParams({displayLibraries: true})
    }

    get displayLibraries() {
        return this.props.navigation.getParam('displayLibraries', false);
    }
}

function Label({style, ...props}) {
    style = style ? [styles.label, style] : styles.label;
    return <Text {...props} style={style} />;
}

function Value(props) {
    return <Text {...props} style={styles.value} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
    },
    label: {
        marginTop: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontSize: 18,
    },
    value: {
        fontSize: 18,
    }
})

