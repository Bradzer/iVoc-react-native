import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Icon, ListItem, Overlay, Button } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { connect } from 'react-redux'
import store from '../reducers'

import AppConstants from '../Constants'
import { 
    updateReviewContent, 
    showNoVocabulary, 
    resetReviewLayout, 
    showReviewOver, 
    hideReviewOverlay, 
    displayReviewOverlayWithData, 
    displayReviewOverlay, 
    updateReviewButtons, } from '../actions'
import reactotron from '../ReactotronConfig';

const Realm = require('realm');

let listOfWords = []
let randomWordOriginalId = ''

const wordsDetailsCollection = firebase.firestore().collection('wordsDetails')
const wordsCollection = firebase.firestore().collection('words')

class ReviewVocabulary extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={{display: this.props.reviewIntroTextDisplay}}>{this.props.reviewIntroText}</Text>
                <View style={{display: this.props.displayReviewContent}}>
                    <Text>{this.props.reviewWord}</Text>
                    <View style={[styles.buttonGroup]}>
                        <Button
                        icon={{name: this.props.reviewLeftBtnIconName, type: this.props.reviewLeftBtnIconType}}
                        title= {this.props.reviewLeftBtnTitle}
                        containerStyle={{marginHorizontal: 16}}
                        onPress={((this.props.reviewLeftBtnTitle !== 'No') ? showDefinitionBtnClicked : ()  => noBtnClicked(randomWordOriginalId))}
                        />
                        <Button
                        icon={{name: this.props.reviewRightBtnIconName, type: this.props.reviewRightBtnIconType}}
                        title= {this.props.reviewRightBtnTitle}
                        containerStyle={{marginHorizontal: 16}}
                        onPress={((this.props.reviewRightBtnTitle !== 'Yes') ? nextBtnClicked : yesBtnClicked)}
                        />
                    </View>
                </View>
                <Overlay isVisible={this.props.reviewOverlayDisplay} width='auto' height='auto' onBackdropPress={onBackdropPress}>
                    <View>
                        <Text>{this.props.reviewWord}</Text>
                        <Text>Pronunciation: {this.props.reviewPronunciation}</Text>
                        <Text>Frequency: {this.props.reviewFrequency}</Text>
                        <Text></Text>
                        <Text>Definitions</Text>
                        <Text></Text>
                        <Text>{this.props.reviewDefinition}</Text>
                    </View>
                </Overlay>

            </View>
        )
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            listOfWords = []
            wordsCollection.get()
            .then((queryResult) => {
                queryResult.forEach((doc) => {
                    listOfWords.push(doc.data())
                })
                if(listOfWords.length === 0) {
                    store.dispatch(showNoVocabulary())
                }
                else {
                    let randomIndex = Math.floor(Math.random() * listOfWords.length)
                    let randomWord = listOfWords[randomIndex]
                    randomWordOriginalId = randomWord.originalId
                    store.dispatch(updateReviewContent(randomWord.label))
                    listOfWords = listOfWords.filter((value, index) => index !== randomIndex)
                }
            })
          });
    }

    componentWillUnmount() {
        store.dispatch(resetReviewLayout())
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
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
    }

})

function mapStateToProps(state) {
    return {
        reviewIntroTextDisplay: state.reviewIntroTextDisplay,
        displayReviewContent: state.displayReviewContent,
        reviewWord: state.reviewWord,
        reviewLeftBtnTitle: state.reviewLeftBtnTitle,
        reviewLeftBtnIconName: state.reviewLeftBtnIconName,
        reviewLeftBtnIconType: state.reviewLeftBtnIconType,    
        reviewRightBtnTitle: state.reviewRightBtnTitle,
        reviewRightBtnIconName: state.reviewRightBtnIconName,
        reviewRightBtnIconType: state.reviewRightBtnIconType,
        reviewIntroText: state.reviewIntroText,
        reviewOverlayDisplay: state.reviewOverlayDisplay,
        reviewPronunciation: state.reviewPronunciation,
        reviewFrequency: state.reviewFrequency,
        reviewDefinition: state.reviewDefinition,
        reviewOriginalId: state.reviewOriginalId

    }
}

const showDefinitionBtnClicked = () => {
    store.dispatch(displayReviewOverlay())
}

const noBtnClicked = (originalId) => {
    reactotron.logImportant('original id : ', originalId)
    wordsDetailsCollection.doc(originalId).get()
    .then((docSnapshot) => {
        store.dispatch(displayReviewOverlayWithData(docSnapshot.data()))
    })
}

const nextBtnClicked = () => {
    goToNextReviewWord()
    store.dispatch(updateReviewButtons())
}

const yesBtnClicked = () => {
    goToNextReviewWord()
    store.dispatch(updateReviewButtons())
}

const onBackdropPress = () => {
    store.dispatch(hideReviewOverlay())
}

function goToNextReviewWord() {
    reactotron.logImportant(listOfWords)
    if (listOfWords.length > 0) {
        // reactotron.logImportant('list > 0')
        if(listOfWords.length === 1) {
            // reactotron.logImportant('list = 1')
            let randomWord = listOfWords[0]
            randomWordOriginalId = randomWord.originalId
            store.dispatch(updateReviewContent(randomWord.label, randomWord.originalId))
            listOfWords = listOfWords.filter((value, index) => index !== 0)
        }
        else {
            // reactotron.logImportant('list > 1')
            let randomIndex = Math.floor(Math.random() * listOfWords.length)
            let randomWord = listOfWords[randomIndex]
            randomWordOriginalId = randomWord.originalId
            store.dispatch(updateReviewContent(randomWord.label, randomWord.originalId))
            listOfWords = listOfWords.filter((value, index) => index !== randomIndex)                
        }
    }
    else {
        reactotron.logImportant('list = 0')
        store.dispatch(showReviewOver())
    }
}
