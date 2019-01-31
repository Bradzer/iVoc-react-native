import React from 'react';
import { StyleSheet, FlatList, View, Text, ToastAndroid } from 'react-native';
import { Icon, ListItem, Overlay, SearchBar } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { connect } from 'react-redux'
import store from '../reducers'
import { BallIndicator } from 'react-native-indicators'

import {MyVocabularyOverflowMenu} from './OverflowMenu'
import AppConstants from '../Constants'
import { 
    displayVocabularyOverlay, 
    hideVocabularyOverlay, 
    updateListOfWords, 
    deleteWordInList, 
    updateSearchValue,
    updateSearchResults,
    showLoadingIndicator, } from '../actions'

    let firebaseAuth = null
    let userId = null
    let userWordsDetailsCollection = null
        
class MyVocabulary extends React.Component {
    
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: 'Vocabulary',
            tabBarLabel: AppConstants.STRING_TAB_MY_VOCABULARY,
            tabBarIcon: <Icon name= 'file-document' type= 'material-community'/>,
            headerStyle: {
                backgroundColor: AppConstants.APP_PRIMARY_COLOR
              },
              headerTintColor: AppConstants.COLOR_WHITE,
              headerRight: <MyVocabularyOverflowMenu navigation={navigation} />          
        }
    }

    listOfWords = []

    render() {   

        return(
            <View style={styles.container}>
                <SearchBar 
                placeHolder= 'Seach...' value= ''
                value= {this.props.searchBarValue}
                onChangeText= {onSearchValueChanged}
                />
                {(this.props.displayLoadingIndicator) ?
                    (
                        <View style={styles.loadingIndicator}>
                            <BallIndicator />
                        </View>
                    ) :
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={this.props.listOfWords} 
                        renderItem={renderItem}
                    />
                }
                <Overlay isVisible={this.props.vocabularyOverlayDisplay} width='auto' height='auto' onBackdropPress={onBackdropPress}>
                    <View>
                        <Text>{this.props.vocabularyWord}</Text>
                        <Text>Pronunciation: {this.props.vocabularyPronunciation}</Text>
                        <Text>Frequency: {this.props.vocabularyFrequency}</Text>
                        <Text></Text>
                        <Text>Definitions</Text>
                        <Text></Text>
                        <Text>{this.props.vocabularyDefinition}</Text>
                    </View>
                </Overlay>
            </View>
        )
    }


    componentDidMount() {
        
        this.props.navigation.setParams({
            showClearDoneToast: showClearDoneToast,
            onSearchValueChanged: onSearchValueChanged,
            getSearchBarValue: this.getSearchBarValue,
        })
        firebaseAuth = firebase.auth()
        userId = firebaseAuth.currentUser.uid
        userWordsDetailsCollection = firebase.firestore().collection('wordsDetails/' + userId + '/userWordsDetails')

        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            onSearchValueChanged(this.props.searchBarValue)
          });
    }

    getSearchBarValue = () => {
        return this.props.searchBarValue
    }
}

export default connect(mapStateToProps)(MyVocabulary)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    //   alignItems: 'center',
      justifyContent: 'flex-start',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
  });

function mapStateToProps(state) {
    return {
        vocabularyOverlayDisplay: state.vocabularyOverlayDisplay,
        vocabularyWord: state.vocabularyWord,
        vocabularyPartOfSpeech: state.vocabularyPartOfSpeech,
        vocabularyDefinition: state.vocabularyDefinition,
        vocabularyPronunciation: state.vocabularyPronunciation,
        vocabularyFrequency: state.vocabularyFrequency,
        listOfWords: state.listOfWords,
        searchBarValue: state.searchBarValue,
        displayLoadingIndicator: state.displayLoadingIndicator
    }
}


  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({item, index}) => {
    
    let successPercentage = (item.numberOfRemembrances / item.numberOfAppearances) * 100
    successPercentage = (successPercentage.toString()).substring(0, 5) + '%'
    return(
    <ListItem
        title={item.word}
        subtitle={item.partOfSpeech}
        rightIcon= {<Icon name= 'delete' onPress={() => deleteWordPressed(item, index)}/>}
        onPress= {() => itemPressed(item)}
        rightTitle= {successPercentage}
    />
    )
  }

  const itemPressed = (wordDetails) => {
    store.dispatch(displayVocabularyOverlay(wordDetails))
  }

  const onBackdropPress = () => {
    store.dispatch(hideVocabularyOverlay())
  }

  const deleteWordPressed = (item, index) => {
    userWordsDetailsCollection.doc(item.id).delete()
    store.dispatch(deleteWordInList(index))
    ToastAndroid.show('deleted', ToastAndroid.SHORT)
  }

  const onSearchValueChanged = (changedText) => {
        store.dispatch(showLoadingIndicator())
        store.dispatch(updateSearchValue(changedText))
        if(changedText) {
            let listOfWords = []
            userWordsDetailsCollection.get()
            .then((queryResult) => {
                queryResult.forEach((doc) => {
                    listOfWords.push(doc.data())
                })
                store.dispatch(updateListOfWords(listOfWords))
                store.dispatch(updateSearchResults(changedText))
            })
        }
        else {
            let listOfWords = []
            userWordsDetailsCollection.get()
            .then((queryResult) => {
                queryResult.forEach((doc) => {
                    listOfWords.push(doc.data())
                })
                store.dispatch(updateListOfWords(listOfWords))
                if(listOfWords.length === 0) {
                    ToastAndroid.show('You have no vocabulary', ToastAndroid.SHORT)
                    ToastAndroid.show('Please add some words/expressions to your vocabulary', ToastAndroid.SHORT)
                }    
            })
        }
  }

  const showClearDoneToast = () => {
          ToastAndroid.show('vocabulary list cleared', ToastAndroid.SHORT)
  }
  