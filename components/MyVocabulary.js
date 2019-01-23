import React from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { Icon, ListItem, Overlay } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import { connect } from 'react-redux'
import store from '../reducers'

import AppConstants from '../Constants'
import { displayVocabularyOverlay, hideVocabularyOverlay, updateVocabularyLabel } from '../actions'


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
                    data={this.listOfWords} 
                    renderItem={renderItem}
                />
                <Overlay isVisible={this.props.vocabularyOverlayDisplay} width='auto' height='auto' onBackdropPress={onBackdropPress}>
                    <Text>{this.props.vocabularyLabel}</Text>
                </Overlay>
            </View>
        )
    }


    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            this.listOfWords = []
            wordsCollection.get()
            .then((queryResult) => {
                queryResult.forEach((doc) => {
                    this.listOfWords.push(doc.data())
                })
            this.forceUpdate()
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
        vocabularyLabel: state.vocabularyLabel
    }
}


  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({item}) => (
    <ListItem
        title={item.label}
        // subtitle={item.subtitle}
        rightIcon= {<Icon name= 'keyboard-arrow-right' />}
        onPress= {() => itemPressed(item.label)}
    />
  )

  const itemPressed = (label) => {
      store.dispatch(updateVocabularyLabel(label))
      store.dispatch(displayVocabularyOverlay())
  }

  const onBackdropPress = () => {
      store.dispatch(hideVocabularyOverlay())
  }
  