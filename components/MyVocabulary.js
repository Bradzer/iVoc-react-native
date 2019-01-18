import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'
import SyncStorage from 'sync-storage';

import AppConstants from '../Constants'

const wordsDetailsCollection = firebase.firestore().collection('wordsDetails')
const wordsCollection = firebase.firestore().collection('words')

export default class MyVocabulary extends React.Component {
    
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
            </View>
        )
    }


    componentDidMount() {
        this.focusListener = this.props.navigation.addListener("didFocus", () => {
            console.log(SyncStorage.get('selectedIndex'));
            console.log(SyncStorage.get('startingLettersChecked'));
            console.log(SyncStorage.get('endingLettersChecked'));
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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    //   alignItems: 'center',
      justifyContent: 'flex-start',
    },
  });

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({item}) => (
    <ListItem
        title={item.label}
        // subtitle={item.subtitle}
        rightIcon= {<Icon name= 'keyboard-arrow-right' />}
    />
  )
  