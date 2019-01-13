import React from 'react';
import { StyleSheet, View, } from 'react-native';
import { Button, Icon } from 'react-native-elements'
import { firestore } from 'react-native-firebase'

import AppConstants from '../Constants'

// const firebaseConfig = {
//     apiKey: "AIzaSyBMSmMRgE9K0Cw9fF2ZZCbfLX07FA-2wYM",
//     authDomain: "ivoc-react-native.firebaseapp.com",
//     databaseURL: "https://ivoc-react-native.firebaseio.com/",
//     storageBucket: "gs://ivoc-react-native.appspot.com"
//   };

// firebase.config(firebaseConfig)

wordsCollection = firestore().collection('words')

wordsCollection.add({
    label: 'chat',
    definition: 'cat'
})


export default class Home extends React.Component {

    static navigationOptions = {
        headerTitle: AppConstants.APP_NAME,
        tabBarLabel: AppConstants.STRING_TAB_HOME,
        tabBarIcon: <Icon name= 'home' />
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
                    onPress={() => this.props.navigation.navigate('RandomPractice')}
                    />
                </View>
            </View>
        )
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