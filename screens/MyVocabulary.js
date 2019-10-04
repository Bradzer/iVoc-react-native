// /* eslint-disable react/prop-types */
/* global setTimeout clearTimeout */

import React from 'react';
import { StyleSheet, FlatList, View, Text, ToastAndroid, BackHandler, ScrollView } from 'react-native';
import { Icon, ListItem, Overlay, SearchBar, Divider } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { BallIndicator } from 'react-native-indicators'
import { inject, observer } from 'mobx-react'
import { reaction, toJS, } from 'mobx'
import * as Animatable from 'react-native-animatable';
import Snackbar from 'react-native-snackbar';
import { NavigationEvents } from 'react-navigation';

import MyVocabularyOverflowMenu from '../fragments/MyVocabularyOverflowMenu'
import AppConstants from '../constants/Constants'
import Strings from '../constants/Strings'
import Toasts from '../constants/Toasts'
import BanTypes from '../constants/BanTypes'
import SortTypes from '../constants/SortTypes'
import reactotron from '../ReactotronConfig';

    const firebaseAuth = firebase.auth()
    let userId = null
    let userWordsDetailsCollection = null
    const blackListCollection = firebase.firestore().collection('blacklist')
    let timer = null

    let componentsRefName = []

    let isComponentAboutToBlur = false

class MyVocabulary extends React.Component {

    store = this.props.store

    animationOnOffReactionDisposer = reaction(
        () => this.store.multiDeletionStatus,
        multiDeletionStatus => {
            if(multiDeletionStatus) {
                showMultiDeletionOnToast()
                this.store.enableVocabularyListPulseAnimation()
                this.store.disableMultiDeletionMenuOption()    
            }
            else {
                if(!isComponentAboutToBlur) showMultiDeletionOffToast()
                else isComponentAboutToBlur = false
                this.store.disableVocabularyListPulseAnimation()
                this.store.enableMultiDeletionMenuOption()

            }
        })

    vocabularyClearDoneReactionDisposer = reaction(
        () => this.store.isVocabularyClearDone,
        isVocabularyClearDone => {
            if(isVocabularyClearDone) {
                showClearDoneToast()
                this.onSearchValueChanged(this.getSearchBarValue())
            }
        }
    )

    myRef = null

    static navigationOptions = () => {
        return {
            headerTitle: Strings.STRING_VOCABULARY,
            tabBarLabel: Strings.STRING_TAB_MY_VOCABULARY,
            tabBarIcon: <Icon name= 'file-document' type= 'material-community'/>,
            headerStyle: {
                backgroundColor: AppConstants.APP_PRIMARY_COLOR
              },
              headerTintColor: AppConstants.COLOR_WHITE,
              headerRight: <MyVocabularyOverflowMenu />
        }
    }

    listOfWords = []

    render() {   

        return(
            <View style={styles.container}>
                <NavigationEvents
                    onDidFocus={() => this.onDidFocus()}
                    onWillBlur={() => this.onWillBlur()}
                />
                <SearchBar 
                placeholder= {Strings.STRING_SEARCH}
                value= {this.store.searchBarValue}
                onChangeText= {(changedText) => this.onSearchValueChanged(changedText, true)}
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
                        extraData={toJS([this.store.vocabularyListPulseAnimation, this.store.itemsToHide])}
                    />
                }
                <Overlay isVisible={this.store.vocabularyOverlayDisplay} width='auto' height='auto' onBackdropPress={this.onBackdropPress} overlayStyle={{maxHeight: 300, maxWidth: 300, minHeight: 300, minWidth: 300}}>
                    <ScrollView style={{flex: 1}} contentContainerStyle={{flex: 0}}>
                    <View>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>{this.store.vocabularyWord}</Text>
                        <Text style={{color: 'black', display: this.store.vocabularyPronunciation === Strings.STRING_EMPTY ? 'none' : 'flex'}}>{Strings.STRING_PRONUNCIATION} {this.store.vocabularyPronunciation}</Text>
                        <Text style={{color: 'black', display: this.store.vocabularyFrequency === Strings.STRING_EMPTY ? 'none' : 'flex'}}>{Strings.STRING_FREQUENCY} {this.store.vocabularyFrequency}</Text>
                        <Text style={{color: 'black', textDecorationLine: 'underline', display: this.store.vocabularyDefinition.length > 0 ? 'flex' : 'none'}}>{'\n'}{Strings.STRING_DEFINITIONS}{'\n'}</Text>
                        { this.store.vocabularyDefinition.map((element, index, array) => {
                        if(array.length !== 1)
                        return (
                            <View key={index}>
                                <Text style={{fontWeight: 'bold'}}>{index + 1}.</Text>
                                <Text style={{color: 'black', display: element.partOfSpeech === Strings.STRING_EMPTY ? 'none' : 'flex'}}>{element.partOfSpeech}</Text>
                                <Text style={{fontStyle: 'italic'}}>{element.definition}{'\n'}</Text>
                            </View>

                        )
                        else
                        return (
                            <View key={index}>
                                <Text style={{color: 'black', display: element.partOfSpeech === Strings.STRING_EMPTY ? 'none' : 'flex'}}>{element.partOfSpeech}</Text>
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
        userId = firebaseAuth.currentUser.uid
        userWordsDetailsCollection = firebase.firestore().collection(Strings.STRING_WORDS_DETAILS + userId + Strings.STRING_USER_WORDS_DETAILS)
    }

    componentWillUnmount() {
        this.animationOnOffReactionDisposer && this.animationOnOffReactionDisposer()
        this.vocabularyClearDoneReactionDisposer && this.vocabularyClearDoneReactionDisposer()
    }

    onDidFocus = () => {
        this.onSearchValueChanged(this.store.searchBarValue, false)
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        this.manageAccountStatus()
    }

    onWillBlur = () => {
        isComponentAboutToBlur = true
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        this.store.setMultiDeletionStatus(false)
        this.store.setVocabularyClearDone(false)
        componentsRefName = []
    }


    manageAccountStatus = () => {
        blackListCollection.where('id', '==', userId).get()
        .then((querySnapshot) => {
            if(!querySnapshot.empty) {
                signOut()
                querySnapshot.forEach((docSnapshot) => {
                    switch(docSnapshot.data().banType) {
                        case BanTypes.DELETED:
                            ToastAndroid.show(Toasts.TOAST_ACCOUNT_DELETED, ToastAndroid.SHORT)
                            break;

                        case BanTypes.DISABLED:
                            ToastAndroid.show(Toasts.TOAST_ACCOUNT_DISABLED, ToastAndroid.SHORT)
                            break;
                    }
                })
            }
        },
        () => ToastAndroid.show(Toasts.TOAST_ERROR, ToastAndroid.SHORT))
    }

    getSearchBarValue = () => {
        return this.store.searchBarValue
    }

    onBackButtonPressAndroid = () => {
        if (this.store.multiDeletionStatus) {
            this.store.setMultiDeletionStatus(false)
            return true;
        }
        
        if(this.store.isVocMenuOpen) {
            this.store.setCloseVocMenu(true)
            return true
        }
        return false;
      };

      onTrashIconPressed = (wordDetails, index) => {
        let isUndoDeletePressed = false
        let tempListWithoutRemoval = this.store.listOfWords
        this.store.deleteWordInList(index)
        Snackbar.show({
            title: 'Delete',
            duration: Snackbar.LENGTH_LONG,
            action: {
                title: 'UNDO',
                color: 'green',
                onPress: () => {
                    isUndoDeletePressed = true
                    this.onUndoDeletePressed(tempListWithoutRemoval)
                },
            },
            });
        setTimeout(() => {
            if(!isUndoDeletePressed) this.deleteWordPressed(wordDetails)
        }, 3000)
        }

    itemPressed = (wordDetails, index) => {
        let isUndoDeletePressed = false
        if(!this.store.multiDeletionStatus) this.store.displayVocabularyOverlay(wordDetails)
        else {
            let tempListWithoutRemoval = this.store.listOfWords
            this.store.deleteWordInList(index)
            Snackbar.show({
                title: 'Delete',
                duration: Snackbar.LENGTH_LONG,
                action: {
                  title: 'UNDO',
                  color: 'green',
                  onPress: () => {
                      isUndoDeletePressed = true
                      this.onUndoDeletePressed(tempListWithoutRemoval)
                    },
                },
              });
            setTimeout(() => {
                if(!isUndoDeletePressed) this.deleteWordPressed(wordDetails)
            }, 3000)
        }
    }

  onBackdropPress = () => {
    this.store.hideVocabularyOverlay()
  }

  onUndoDeletePressed = (tempListWithoutRemoval) => {
      this.store.updateListOfWords(tempListWithoutRemoval)
      this.syncPulseAnimation()
  }

  syncPulseAnimation = () => {
    if(this.store.multiDeletionStatus) {
        this.store.disableVocabularyListPulseAnimation()
        this.store.enableVocabularyListPulseAnimation()
    }
  }

  deleteWordPressed = (item) => {
    userWordsDetailsCollection.doc(item.id).delete()
  }

  onSearchValueCleared = () => {
    if(timer) clearTimeout(timer)   
    this.store.showLoadingIndicator()
    let listOfWords = []
    userWordsDetailsCollection.get()
    .then((queryResult) => {
        queryResult.forEach((doc) => {
            listOfWords.push(doc.data())
        })
        this.store.updateListOfWords(listOfWords)
        if(listOfWords.length === 0) {
            ToastAndroid.show(Toasts.TOAST_NO_VOC, ToastAndroid.SHORT)
            ToastAndroid.show(Toasts.TOAST_ADD_WORDS_TO_VOC, ToastAndroid.SHORT)
        }
    })
}
  onSearchValueChanged = (changedText, withTimer) => {
        this.store.updateSearchValue(changedText)
        if(withTimer) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                this.store.showLoadingIndicator()
                let listOfWords = []
                userWordsDetailsCollection.get()
                .then((queryResult) => {
                    queryResult.forEach((doc) => {
                        listOfWords.push(doc.data())
                    })
                    this.store.updateListOfWords(listOfWords)
                    this.store.updateSearchResults(changedText)
                    this.store.updateDefaultListOfWords()
                    this.applySort()
                    if(listOfWords.length === 0) {
                        ToastAndroid.show(Toasts.TOAST_SEARCH_NO_RESULT, ToastAndroid.SHORT)
                    }            
                })    
            }, 1000)
        }
        else {
            this.store.showLoadingIndicator()
            let listOfWords = []
            userWordsDetailsCollection.get()
            .then((queryResult) => {
                queryResult.forEach((doc) => {
                    listOfWords.push(doc.data())
                })
                this.store.updateListOfWords(listOfWords)
                this.store.updateSearchResults(changedText)
                this.store.updateDefaultListOfWords()
                this.applySort()
                if(listOfWords.length === 0) {
                    ToastAndroid.show(Toasts.TOAST_NO_VOC, ToastAndroid.SHORT)
                    ToastAndroid.show(Toasts.TOAST_ADD_WORDS_TO_VOC, ToastAndroid.SHORT)
                }        
            })    
        }
  }

  applySort = () => {
    switch(this.store.sortType) {
        case SortTypes.DEFAULT:
            break;

        case SortTypes.ALPHABETICAL:
            this.store.sortAlphabetical()
            break;

        case SortTypes.ALPHABETICAL_REVERSE:
            this.store.sortAlphabeticalReverse();
            break;

        case SortTypes.LENGTH:
            this.store.sortLength()
            break;

        case SortTypes.LENGTH_DESCENDING:
            this.store.sortLengthDescending()
            break;
    }
  }

  itemLongPressed = () => {
    if(this.store.multiDeletionStatus) this.store.setMultiDeletionStatus(false)
    else this.store.setMultiDeletionStatus(true)
  }

  renderItem = ({item, index}) => {
    
    let successPercentage = (item.numberOfRemembrances / item.numberOfAppearances) * 100
    successPercentage = (successPercentage.toString()).substring(0, 5) + '%'

        return(
            <Animatable.View ref={component => {
                this["_wordView"+index] = component
                componentsRefName.push("_wordView"+index)
                }} animation={this.store.vocabularyListPulseAnimation} iterationCount="infinite">
                <ListItem
                    title={item.word}
                    subtitle={item.partOfSpeech}
                    rightIcon= {<Icon name= 'delete' onPress={() => this.onTrashIconPressed(item, index)}/>}
                    onPress= {() => this.itemPressed(item, index)}
                    rightTitle= {successPercentage}
                    rightTitleStyle= {{display: (item.numberOfAppearances >= 11 ? 'flex' : 'none')}}
                    onLongPress={() => this.itemLongPressed()}
                    subtitleStyle={{display: item.partOfSpeech === Strings.STRING_EMPTY ? 'none' : 'flex'}}
                />
                <Divider />
            </Animatable.View>

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
          ToastAndroid.show(Toasts.TOAST_VOC_LIST_CLEARED, ToastAndroid.SHORT)
  }

  const showMultiDeletionOnToast = () => {
      ToastAndroid.show(Toasts.TOAST_MULTI_DEL_ON, ToastAndroid.SHORT)
  }

  const showMultiDeletionOffToast = () => {
      ToastAndroid.show(Toasts.TOAST_MULTI_DEL_OFF, ToastAndroid.SHORT)
  }  

  function signOut() {
    firebaseAuth.signOut()
}