import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Icon, ListItem, Overlay } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { connect } from 'react-redux'
import store from '../reducers'

import AppConstants from '../Constants'
import { } from '../actions'

const Realm = require('realm');

const wordsDetailsCollection = firebase.firestore().collection('wordsDetails')
const wordsCollection = firebase.firestore().collection('words')

class ReviewVocabulary extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>Review Vocabulary</Text>
            </View>
        )
    }
}

export default connect(mapStateToProps)(ReviewVocabulary)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8
    },
})

function mapStateToProps(state) {
    return {
    }
}

