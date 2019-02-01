import React from 'react';
import { StyleSheet, View, Text, ToastAndroid, BackHandler } from 'react-native';
import { Overlay, Button, Icon, Input } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { connect } from 'react-redux'
import store from '../reducers'
import { BallIndicator } from 'react-native-indicators'

import { 
    showLoadingIndicator,
    updateReviewContent, 
    showNoVocabulary, 
    resetReviewLayout, 
    showReviewOver, 
    hideReviewOverlay, 
    displayReviewOverlay, 
    updateReviewAnswerTextValue, } from '../actions'
import reactotron from '../ReactotronConfig';

let listOfWords = []
let randomWordOriginalId = ''

let firebaseAuth = null
let userId = null
let userWordsDetailsCollection = null

let _didFocusSubscription = null;
let _willBlurSubscription = null;

class ReviewVocabulary extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: 'Review',
            headerLeft: <Icon name='arrow-back' color='white' underlayColor='#367b38' onPress={() => {
                let removeWillBlurSub = navigation.getParam('removeWillBlurSub')
                removeWillBlurSub()
                navigation.navigate('Home')
            }}/>,
            headerLeftContainerStyle: {
                marginLeft: 16
            }
        }
    }

    render() {

        if(this.props.displayLoadingIndicator) {
            return (
                <View style={styles.loadingIndicator}>
                    <BallIndicator />
                </View>
            )
        }

        if(this.props.showNoVocabulary) {
            return (
                <View style={styles.loadingIndicator}>
                    <Text>Your vocabulary is empty</Text>
                </View>
            )
        }

        if(this.props.showReviewOver) {
            return (
                <View style={styles.loadingIndicator}>
                    <Text>The review is over</Text>
                </View>
            )
        }
        return (
            <View style={[styles.container, {display: this.props.displayReviewContent}]}>
                <Text>The word/expression starts with letter</Text>
                <Text>{this.props.reviewStartingLetter}{'\n'}</Text>
                <Text>And ends with letter</Text>
                <Text>{this.props.reviewEndingLetter}{'\n'}</Text>
                <Text>Definition</Text>
                <Text>{this.props.currentRewiewDefinition}</Text>
                <Input
                    placeholder= "What's the word ?"
                    onChangeText= {onReviewAnswerTextChanged}
                    value={this.props.reviewAnswerText}
                    containerStyle={{marginBottom: 16,}}
                />
                <Button 
                    title='Confirm'
                    icon={<Icon name='check-circle' type='font-awesome'/>}
                    onPress={() => this.onConfirmAnswerPressed(this.props.reviewAnswerText)}/>


                <Overlay isVisible={this.props.reviewOverlayDisplay} width='auto' height='auto' onBackdropPress={onBackdropPress}>
                    <View>
                        <Text>{this.props.reviewWord}</Text>
                        <Text>Pronunciation: {this.props.reviewPronunciation}</Text>
                        <Text>Frequency: {this.props.reviewFrequency}{'\n'}</Text>
                        <Text>Definitions{'\n'}</Text>
                        {this.props.reviewDefinition.map((element, index, array) => {
                        if(array.length !== 1)
                        return (
                            <View key={index}>
                                <Text>{index + 1}.</Text>
                                <Text>{element.partOfSpeech}</Text>
                                <Text>{element.definition}{'\n'}</Text>
                            </View>

                        )
                        else
                        return (
                            <View key={index}>
                                <Text>{element.partOfSpeech}</Text>
                                <Text>{element.definition}</Text>
                            </View>
                        )
                    })}
                    </View>
                </Overlay>

            </View>
        )
    }

    componentDidMount() {
        
        store.dispatch(showLoadingIndicator())

        this.props.navigation.setParams({
            removeWillBlurSub: this.removeWillBlurSub
        })

        didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
            firebaseAuth = firebase.auth()
            userId = firebaseAuth.currentUser.uid
            userWordsDetailsCollection = firebase.firestore().collection('wordsDetails/' + userId + '/userWordsDetails')
    
            listOfWords = []
            userWordsDetailsCollection.get()
            .then((queryResult) => {
                queryResult.forEach((doc) => {
                    listOfWords.push(doc.data())
                })
                if(listOfWords.length === 0) {
                    store.dispatch(showNoVocabulary())
                    ToastAndroid.show('You have no vocabulary', ToastAndroid.SHORT)
                    ToastAndroid.show('Please add some words/expressions to your vocabulary', ToastAndroid.SHORT)
                }
                else {
                    let randomIndex = Math.floor(Math.random() * listOfWords.length)
                    let randomWord = listOfWords[randomIndex]
                    randomWordOriginalId = randomWord.id
                    let randomDefIndex = Math.floor(Math.random() * randomWord.definition.length)
                    store.dispatch(updateReviewContent(randomWord, randomDefIndex))
                    listOfWords = listOfWords.filter((value, index) => index !== randomIndex)
                }
            }) 
            });
    
        _willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
            ToastAndroid.show('You unexpectedlty left the review', ToastAndroid.SHORT)
            ToastAndroid.show('The word will be supposed not remembered', ToastAndroid.SHORT)
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        updateNumberOfAppearances(randomWordOriginalId)
        });
    }

    componentWillUnmount() {

        _didFocusSubscription && _didFocusSubscription.remove();
        _willBlurSubscription && _willBlurSubscription.remove();

        store.dispatch(resetReviewLayout())
    }

    onConfirmAnswerPressed = (answer) => {
        if(answer === this.props.reviewWord) {
            ToastAndroid.show('right answer ;)', ToastAndroid.SHORT)
            updateNumberOfAppearances(randomWordOriginalId)
            updateNumberOfRemembrances(randomWordOriginalId)        
            goToNextReviewWord()
        }
        else {
            ToastAndroid.show('You got it wrong :(', ToastAndroid.SHORT)
            updateNumberOfAppearances(randomWordOriginalId)
            store.dispatch(displayReviewOverlay())
        }
    }    

    onBackButtonPressAndroid = () => {
        _willBlurSubscription.remove()
        return false
      };

      removeWillBlurSub = () => {
        _willBlurSubscription.remove()
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
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
        reviewOriginalId: state.reviewOriginalId,
        displayLoadingIndicator: state.displayLoadingIndicator,
        reviewStartingLetter: state.reviewStartingLetter,
        reviewEndingLetter: state.reviewEndingLetter,
        currentRewiewDefinition: state.currentRewiewDefinition,
        reviewAnswerText: state.reviewAnswerText,
        showNoVocabulary: state.showNoVocabulary,
        showReviewOver: state.showReviewOver,
    }
}

const onBackdropPress = () => {
    store.dispatch(hideReviewOverlay())
    goToNextReviewWord()
}

function goToNextReviewWord() {
    if (listOfWords.length > 0) {
        if(listOfWords.length === 1) {
            let randomWord = listOfWords[0]
            randomWordOriginalId = randomWord.id
            let randomDefIndex = Math.floor(Math.random() * randomWord.definition.length)
            store.dispatch(updateReviewContent(randomWord.word, randomDefIndex))
            listOfWords = listOfWords.filter((value, index) => index !== 0)
        }
        else {
            let randomIndex = Math.floor(Math.random() * listOfWords.length)
            let randomWord = listOfWords[randomIndex]
            randomWordOriginalId = randomWord.id
            let randomDefIndex = Math.floor(Math.random() * randomWord.definition.length)
            store.dispatch(updateReviewContent(randomWord.word, randomDefIndex))
            listOfWords = listOfWords.filter((value, index) => index !== randomIndex)                
        }
    }
    else {
        store.dispatch(showReviewOver())
        ToastAndroid.show('Your vocabulary review is done', ToastAndroid.SHORT)
        _willBlurSubscription.remove()
    }
}

function updateNumberOfAppearances(originalId) {
    let numberOfAppearances = 0
    userWordsDetailsCollection.doc(originalId).get()
    .then((docRef) => {
        numberOfAppearances = (docRef.get('numberOfAppearances') + 1)
        userWordsDetailsCollection.doc(originalId).update({numberOfAppearances: numberOfAppearances})
    })
}

function updateNumberOfRemembrances(originalId) {
    let numberOfRemembrances = 0
    userWordsDetailsCollection.doc(originalId).get()
    .then((docRef) => {
        numberOfRemembrances = docRef.get('numberOfRemembrances') +1
        userWordsDetailsCollection.doc(originalId).update({numberOfRemembrances: numberOfRemembrances})
    })
}

const onReviewAnswerTextChanged = (changedText) => {
    store.dispatch(updateReviewAnswerTextValue(changedText))
}