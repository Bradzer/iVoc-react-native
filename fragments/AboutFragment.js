import React from 'react';
import { StyleSheet, View, Text, ToastAndroid, Linking } from 'react-native';
import { Button, } from 'react-native-elements'


import AppConstants from '../constants/Constants'
import AppInfo from '../constants/AppInfo'
import ThanksList from '../constants/ThanksList'


class AboutFragment extends React.Component {

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={{marginTop: 16, fontWeight: 'bold', fontSize: 18}}>{AppConstants.APP_NAME}</Text>
                <Text style={{fontSize: 18}}>version {AppConstants.APP_VERSION}</Text>
                <Text style={{fontSize: 18}}>{AppConstants.STRING_POWERED_BY}</Text>
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
                <Button title={AppConstants.STRING_USED_LIBRARIES} containerStyle={{marginTop: 16}} onPress={this.props.onShowLibrariesPressed}/>
                <Text style={{marginTop: 16, fontWeight: 'bold', textDecorationLine: 'underline', fontSize: 18}}>{AppConstants.STRING_BIG_THANKS}</Text>
                {ThanksList.THANKSLIST_ARRAY.map((element, index, array) => {
                    return <Text key={index} style={{fontSize: 18}}>{element}</Text>
                })}
            </View>
        )
    }

    componentDidMount() {
    }

    componentWillUnmount() {
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

export default AboutFragment