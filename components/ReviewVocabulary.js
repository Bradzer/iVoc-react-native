import React from 'react';
import { StyleSheet, View, Text, ToastAndroid, BackHandler, ScrollView } from 'react-native';
import { Overlay, Button, Icon, Input } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { BallIndicator } from 'react-native-indicators'
import { inject, observer } from 'mobx-react'
import { autorun } from 'mobx'

import reactotron from '../ReactotronConfig';

let listOfWords = []
let randomWordOriginalId = ''

let firebaseAuth = null
let userId = null
let userWordsDetailsCollection = null

let _didFocusSubscription = null;
let _willBlurSubscription = null;

class ReviewVocabulary extends React.Component {

    store = this.props.store

    myAutorun = autorun(() => {
    })

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

        if(this.store.displayLoadingIndicator === true) {
            return (
                <View style={styles.loadingIndicator}>
                    <BallIndicator />
                </View>
            )
        }

        else if(this.store.isNoVocabulary === true) {
            return (
                <View style={styles.loadingIndicator}>
                    <Text style={{fontSize: 24}}>Your vocabulary is empty</Text>
                </View>
            )
        }

        else if(this.store.isReviewOver === true) {
            return (
                <View style={styles.loadingIndicator}>
                    <Text style={{fontSize: 24}}>The review is over</Text>
                </View>
            )
        }
        else return (
            <View style={[styles.container, {display: this.store.displayReviewContent}]}>
                <ScrollView style={{flex: 1, flexGrow: 1}}>
                    <View style={styles.container}>
                        <View style={{display: this.store.displayReviewHint}}>
                        <Text style={{fontSize: 24, color: 'black'}}>The word/expression starts with letters</Text>
                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>{'\''}{this.store.reviewStartingLetter}{'\''}{'\n'}</Text>
                        <Text style={{fontSize: 24, color: 'black'}}>And ends with letters</Text>
                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>{'\''}{this.store.reviewEndingLetter}{'\''}</Text>
                        </View>
                        <Text style={{fontSize: 24, color: 'black', textDecorationLine: 'underline'}}>{'\n'}Definition</Text>
                        <Text style={{fontSize: 18, fontStyle: 'italic'}}>{this.store.currentRewiewDefinition}</Text>
                        <Input
                            placeholder= "What's the word ?"
                            onChangeText= {this.onReviewAnswerTextChanged}
                            value={this.store.reviewAnswerText}
                            containerStyle={{marginBottom: 16,}}
                            returnKeyType= 'go'
                            onSubmitEditing={() => this.onConfirmAnswerPressed(this.store.reviewAnswerText)}
                        />
                        <Button 
                            title='Confirm'
                            icon={<Icon name='check-circle' type='font-awesome'/>}
                            onPress={() => this.onConfirmAnswerPressed(this.store.reviewAnswerText)}
                            />
                    </View>
                </ScrollView>

                <Overlay isVisible={this.store.reviewOverlayDisplay} width='auto' height='auto' onBackdropPress={() => this.onBackdropPress()} overlayStyle={{maxHeight: 300, maxWidth: 300}}>
                <ScrollView style={{flex: 1}} contentContainerStyle={{flex: 0}}>
                    <View>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>{this.store.reviewWord}</Text>
                        <Text style={{color: 'black', display: this.store.reviewPronunciation === 'empty' ? 'none' : 'flex'}}>Pronunciation: {this.store.reviewPronunciation}</Text>
                        <Text style={{color: 'black', display: this.store.reviewFrequency === 'empty' ? 'none' : 'flex'}}>Frequency: {this.store.reviewFrequency}</Text>
                        <Text style={{color: 'black', textDecorationLine: 'underline'}}>{'\n'}Definitions{'\n'}</Text>
                        {this.store.reviewDefinition.map((element, index, array) => {
                        if(array.length !== 1)
                        return (
                            <View key={index}>
                                <Text style={{fontWeight: 'bold'}}>{index + 1}.</Text>
                                <Text style={{color: 'black'}}>{element.partOfSpeech}</Text>
                                <Text style={{fontStyle: 'italic'}}>{element.definition}{'\n'}</Text>
                            </View>

                        )
                        else
                        return (
                            <View key={index}>
                                <Text style={{color: 'black'}}>{element.partOfSpeech}</Text>
                                <Text style={{fontStyle: 'italic'}}>{element.definition}</Text>
                            </View>
                        )
                    })}
                    </View>
                </ScrollView>
                </Overlay>

            </View>
        )
    }

    componentDidMount() {
        
        this.store.showLoadingIndicator()

        this.props.navigation.setParams({
            removeWillBlurSub: this.removeWillBlurSub
        })

        _didFocusSubscription = this.props.navigation.addListener('didFocus', () => {
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
                    this.store.showNoVocabulary()
                    _willBlurSubscription.remove()
                    ToastAndroid.show('You have no vocabulary', ToastAndroid.SHORT)
                    ToastAndroid.show('Please add some words/expressions to your vocabulary', ToastAndroid.SHORT)
                }
                else {
                    let randomIndex = Math.floor(Math.random() * listOfWords.length)
                    let randomWord = listOfWords[randomIndex]
                    randomWordOriginalId = randomWord.id
                    let randomDefIndex = Math.floor(Math.random() * randomWord.definition.length)
                    this.store.updateReviewContent(randomWord, randomDefIndex)
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
        this.myAutorun()

        this.store.resetReviewLayout()
    }

    onConfirmAnswerPressed = (answer) => {
        if(answer === this.store.reviewWord) {
            ToastAndroid.show('right answer ;)', ToastAndroid.SHORT)
            updateNumberOfAppearances(randomWordOriginalId)
            updateNumberOfRemembrances(randomWordOriginalId)        
            this.goToNextReviewWord()
        }
        else {
            ToastAndroid.show('You got it wrong :(', ToastAndroid.SHORT)
            updateNumberOfAppearances(randomWordOriginalId)
            this.store.displayReviewOverlay()
        }
    }    

    onBackButtonPressAndroid = () => {
        _willBlurSubscription.remove()
        return false
      };

      removeWillBlurSub = () => {
        _willBlurSubscription.remove()
      }

    onBackdropPress = () => {
        this.store.hideReviewOverlay()
        this.goToNextReviewWord()
    }
    
    goToNextReviewWord = () => {
        if (listOfWords.length > 0) {
            if(listOfWords.length === 1) {
                let randomWord = listOfWords[0]
                randomWordOriginalId = randomWord.id
                let randomDefIndex = Math.floor(Math.random() * randomWord.definition.length)
                this.store.updateReviewContent(randomWord, randomDefIndex)
                listOfWords = listOfWords.filter((value, index) => index !== 0)
            }
            else {
                let randomIndex = Math.floor(Math.random() * listOfWords.length)
                let randomWord = listOfWords[randomIndex]
                randomWordOriginalId = randomWord.id
                let randomDefIndex = Math.floor(Math.random() * randomWord.definition.length)
                this.store.updateReviewContent(randomWord, randomDefIndex)
                listOfWords = listOfWords.filter((value, index) => index !== randomIndex)                
            }
        }
        else {
            this.store.showReviewOver()
            ToastAndroid.show('Your vocabulary review is done', ToastAndroid.SHORT)
            _willBlurSubscription.remove()
        }
    }
    
    onReviewAnswerTextChanged = (changedText) => {
        this.store.updateReviewAnswerTextValue(changedText)
    }
}

export default inject('store')(observer(ReviewVocabulary))

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

const updateNumberOfAppearances = (originalId) => {
    let numberOfAppearances = 0
    userWordsDetailsCollection.doc(originalId).get()
    .then((docRef) => {
        numberOfAppearances = (docRef.get('numberOfAppearances') + 1)
        userWordsDetailsCollection.doc(originalId).update({numberOfAppearances: numberOfAppearances})
    })
}

const updateNumberOfRemembrances = (originalId) => {
    let numberOfRemembrances = 0
    userWordsDetailsCollection.doc(originalId).get()
    .then((docRef) => {
        numberOfRemembrances = docRef.get('numberOfRemembrances') +1
        userWordsDetailsCollection.doc(originalId).update({numberOfRemembrances: numberOfRemembrances})
    })
}
