import React from 'react';
import { StyleSheet, FlatList, View, Text, ToastAndroid, BackHandler } from 'react-native';
import { Icon, ListItem, Overlay, SearchBar } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { BallIndicator } from 'react-native-indicators'
import { inject, observer } from 'mobx-react'

import {MyVocabularyOverflowMenu} from './OverflowMenu'
import AppConstants from '../Constants'

    let firebaseAuth = null
    let userId = null
    let userWordsDetailsCollection = null
    let multiDeletionStatus = false
        
class MyVocabulary extends React.Component {

    _didFocusSubscription = null;
    _willBlurSubscription = null;

    store = this.props.store
    
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
                placeHolder= 'Seach...'
                containerStyle={{backgroundColor: 'white', borderWidth: 0}}
                value= {this.store.searchBarValue}
                onChangeText= {this.onSearchValueChanged}
                onClear= {this.onSearchValueCleared}
                />
                { this.store.displayLoadingIndicator === true ?
                    (
                        <View style={styles.loadingIndicator}>
                            <BallIndicator />
                        </View>
                    ) :
                    <FlatList
                        keyExtractor={keyExtractor}
                        data={this.store.listOfWords} 
                        renderItem={this.renderItem}
                    />
                }
                <Overlay isVisible={this.store.vocabularyOverlayDisplay} width='auto' height='auto' onBackdropPress={this.onBackdropPress}>
                    <View>
                        <Text>{this.store.vocabularyWord}</Text>
                        <Text>Pronunciation: {this.store.vocabularyPronunciation}</Text>
                        <Text>Frequency: {this.store.vocabularyFrequency}{'\n'}</Text>
                        <Text>Definitions{'\n'}</Text>
                        {this.store.vocabularyDefinition.map((element, index, array) => {
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
        this.store.showLoadingIndicator()
        this.props.navigation.setParams({
            showClearDoneToast: showClearDoneToast,
            onSearchValueChanged: this.onSearchValueChanged,
            getSearchBarValue: this.getSearchBarValue,
            showMultiDeletionOnToast: showMultiDeletionOnToast,
            showMultiDeletionOffToast: showMultiDeletionOffToast,
            getMultiDeletionStatus: getMultiDeletionStatus,
            setMultiDeletionStatus: setMultiDeletionStatus
        })
        firebaseAuth = firebase.auth()
        userId = firebaseAuth.currentUser.uid
        userWordsDetailsCollection = firebase.firestore().collection('wordsDetails/' + userId + '/userWordsDetails')

        this._didFocusSubscription = this.props.navigation.addListener("didFocus", () => {
            this.onSearchValueChanged(this.store.searchBarValue)
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

    getSearchBarValue = () => {
        return this.store.searchBarValue
    }

    onBackButtonPressAndroid = () => {
        if (getMultiDeletionStatus()) {
            showMultiDeletionOffToast()
            setMultiDeletionStatus(false)
            return true;
        } else {
          return false;
        }
      };

    itemPressed = (wordDetails, index) => {
        if(!multiDeletionStatus)
            this.store.displayVocabularyOverlay(wordDetails)
        else {
            this.deleteWordPressed(wordDetails, index)
        }
    }

  onBackdropPress = () => {
    this.store.hideVocabularyOverlay()
  }

  deleteWordPressed = (item, index) => {
    userWordsDetailsCollection.doc(item.id).delete()
    this.store.deleteWordInList(index)
    ToastAndroid.show('deleted', ToastAndroid.SHORT)
  }

  onSearchValueCleared = () => {
    this.store.showLoadingIndicator()
    let listOfWords = []
    userWordsDetailsCollection.get()
    .then((queryResult) => {
        queryResult.forEach((doc) => {
            listOfWords.push(doc.data())
        })
        this.store.updateListOfWords(listOfWords)
        if(listOfWords.length === 0) {
            ToastAndroid.show('You have no vocabulary', ToastAndroid.SHORT)
            ToastAndroid.show('Please add some words/expressions to your vocabulary', ToastAndroid.SHORT)
        }    
    })
  }
  onSearchValueChanged = (changedText) => {
        this.store.showLoadingIndicator()
        this.store.updateSearchValue(changedText)
        let listOfWords = []
        userWordsDetailsCollection.get()
        .then((queryResult) => {
            queryResult.forEach((doc) => {
                listOfWords.push(doc.data())
            })
            this.store.updateListOfWords(listOfWords)
            this.store.updateSearchResults(changedText)
        })
  }

  renderItem = ({item, index}) => {
    
    let successPercentage = (item.numberOfRemembrances / item.numberOfAppearances) * 100
    successPercentage = (successPercentage.toString()).substring(0, 5) + '%'

        return(
        <ListItem
            title={item.word}
            subtitle={item.partOfSpeech}
            rightIcon= {<Icon name= 'delete' onPress={() => this.deleteWordPressed(item, index)}/>}
            onPress= {() => this.itemPressed(item, index)}
            rightTitle= {successPercentage}
            rightTitleStyle= {{display: (item.numberOfAppearances >= 11 ? 'flex' : 'none')}}
        />
        )
  }


}

export default inject('store')(observer(MyVocabulary))

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'flex-start',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
  });

  const keyExtractor = (item, index) => index.toString();

  const showClearDoneToast = () => {
          ToastAndroid.show('vocabulary list cleared', ToastAndroid.SHORT)
  }

  const showMultiDeletionOnToast = () => {
      ToastAndroid.show('Multi deletion is on', ToastAndroid.SHORT)
  }

  const showMultiDeletionOffToast = () => {
      ToastAndroid.show('Multi deletion is off', ToastAndroid.SHORT)
  }

  const getMultiDeletionStatus = () => {
      return multiDeletionStatus
  }

  const setMultiDeletionStatus = (status) => {
      multiDeletionStatus = status
  }
  