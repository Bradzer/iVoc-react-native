import React from 'react';
import { StyleSheet, View, Text, ToastAndroid, BackHandler } from 'react-native';
import { Overlay, Button, Icon } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { connect } from 'react-redux'
import store from '../reducers'
import { BallIndicator } from 'react-native-indicators'

import { 
    updateReviewContent, 
    showNoVocabulary, 
    resetReviewLayout, 
    showReviewOver, 
    hideReviewOverlay, 
    displayReviewOverlayWithData, 
    displayReviewOverlay, 
    updateReviewButtons, 
    showLoadingIndicator,
    hideLoadingIndicator, } from '../actions'
import reactotron from '../ReactotronConfig';

let listOfWords = []
let randomWordOriginalId = ''

let firebaseAuth = null
let userId = null
let userWordsDetailsCollection = null

class ReviewVocabulary extends React.Component {

    _didFocusSubscription = null;
    _willBlurSubscription = null;

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
        
        this.props.navigation.setParams({
            removeWillBlurSub: this.removeWillBlurSub
        })

        this._didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
            store.dispatch(showLoadingIndicator())
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
                    store.dispatch(updateReviewContent(randomWord.word))
                    listOfWords = listOfWords.filter((value, index) => index !== randomIndex)
                }
            }) 
            });
    
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
            ToastAndroid.show('You unexpectedlty left the review', ToastAndroid.SHORT)
            ToastAndroid.show('The word will be supposed not remembered', ToastAndroid.SHORT)
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        updateNumberOfAppearances(randomWordOriginalId)
        });
    }

    componentWillUnmount() {

        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();

        store.dispatch(resetReviewLayout())
    }

    onBackButtonPressAndroid = () => {
        this._willBlurSubscription.remove()
        return false
      };

      removeWillBlurSub = () => {
        this._willBlurSubscription.remove()
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
        displayLoadingIndicator: state.displayLoadingIndicator
    }
}

const showDefinitionBtnClicked = () => {
    store.dispatch(displayReviewOverlay())
}

const noBtnClicked = (originalId) => {
    updateNumberOfAppearances(randomWordOriginalId)
    userWordsDetailsCollection.doc(originalId).get()
    .then((docSnapshot) => {
        store.dispatch(displayReviewOverlayWithData(docSnapshot.data()))
    })
}

const nextBtnClicked = () => {
    goToNextReviewWord()
    store.dispatch(updateReviewButtons())
}

const yesBtnClicked = () => {
    updateNumberOfAppearances(randomWordOriginalId)
    updateNumberOfRemembrances(randomWordOriginalId)
    goToNextReviewWord()
    store.dispatch(updateReviewButtons())
}

const onBackdropPress = () => {
    store.dispatch(hideReviewOverlay())
}

function goToNextReviewWord() {
    reactotron.logImportant(listOfWords)
    if (listOfWords.length > 0) {
        if(listOfWords.length === 1) {
            let randomWord = listOfWords[0]
            randomWordOriginalId = randomWord.id
            store.dispatch(updateReviewContent(randomWord.word))
            listOfWords = listOfWords.filter((value, index) => index !== 0)
        }
        else {
            let randomIndex = Math.floor(Math.random() * listOfWords.length)
            let randomWord = listOfWords[randomIndex]
            randomWordOriginalId = randomWord.id
            store.dispatch(updateReviewContent(randomWord.word))
            listOfWords = listOfWords.filter((value, index) => index !== randomIndex)                
        }
    }
    else {
        reactotron.logImportant('list = 0')
        store.dispatch(showReviewOver())
        ToastAndroid.show('Your vocabulary review is done', ToastAndroid.SHORT)

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
