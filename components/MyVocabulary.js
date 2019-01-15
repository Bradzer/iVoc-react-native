import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Icon, ListItem } from 'react-native-elements'
import firebase, { } from 'react-native-firebase'

import AppConstants from '../Constants'

const wordsDetailsCollection = firebase.firestore().collection('wordsDetails')
const wordsCollection = firebase.firestore().collection('words')

const listofWords = []

export default class MyVocabulary extends React.Component {

    static navigationOptions = {
      headerTitle: AppConstants.APP_NAME,
      tabBarLabel: AppConstants.STRING_TAB_MY_VOCABULARY,
      tabBarIcon: <Icon name= 'file-document' type= 'material-community'/>
    }

    render() {

        return(
            <View style={styles.container}>
                <FlatList
                    keyExtractor={keyExtractor}
                    data={listofWords} 
                    renderItem={renderItem}
                />
            </View>
        )
    }

    UNSAFE_componentWillMount() {
        wordsCollection.get()
        .then((queryResult) => {
            queryResult.forEach((doc) => listofWords.push(doc.data()))
        })
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
  