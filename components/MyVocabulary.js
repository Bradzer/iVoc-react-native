import React from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { Icon, ListItem, Overlay } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { connect } from 'react-redux'
import store from '../reducers'

import AppConstants from '../Constants'
import { clearListOfWords, displayVocabularyOverlay, hideVocabularyOverlay, updateListOfWords, deleteWordInList } from '../actions'


const wordsDetailsCollection = firebase.firestore().collection('wordsDetails')
const wordsCollection = firebase.firestore().collection('words')

class MyVocabulary extends React.Component {
    
    static navigationOptions = {
      headerTitle: AppConstants.APP_NAME,
      tabBarLabel: AppConstants.STRING_TAB_MY_VOCABULARY,
      tabBarIcon: <Icon name= 'file-document' type= 'material-community'/>
    }

    listOfWords = []

    render() {   

        return(
            <View style={styles.container}>
                <FlatList
                    keyExtractor={keyExtractor}
                    data={this.props.listOfWords} 
                    renderItem={renderItem}
                />
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
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            let listOfWords = []
            store.dispatch(clearListOfWords())
            wordsCollection.get()
            .then((queryResult) => {
                queryResult.forEach((doc) => {
                    listOfWords.push(doc.data())
                })
                store.dispatch(updateListOfWords(listOfWords))
            })
          });
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
  });

function mapStateToProps(state) {
    return {
        vocabularyOverlayDisplay: state.vocabularyOverlayDisplay,
        vocabularyWord: state.vocabularyWord,
        vocabularyPartOfSpeech: state.vocabularyPartOfSpeech,
        vocabularyDefinition: state.vocabularyDefinition,
        vocabularyPronunciation: state.vocabularyPronunciation,
        vocabularyFrequency: state.vocabularyFrequency,
        listOfWords: state.listOfWords
    }
}


  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({item, index}) => (
    <ListItem
        title={item.label}
        subtitle={item.partOfSpeech}
        rightIcon= {<Icon name= 'delete' onPress={() => deleteWordPressed(item, index)}/>}
        onPress= {() => itemPressed(item.originalId)}
    />
  )

  const itemPressed = (originalId) => {
    
    wordsDetailsCollection.doc(originalId).get()
    .then((docSnapshot) => {
        store.dispatch(displayVocabularyOverlay(docSnapshot.data()))
    })
  }

  const onBackdropPress = () => {
    store.dispatch(hideVocabularyOverlay())
  }

  const deleteWordPressed = (item, index) => {
    wordsDetailsCollection.doc(item.originalId).delete()
    wordsCollection.doc(item.id).delete()
    store.dispatch(deleteWordInList(index))
  }
  