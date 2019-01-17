import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Icon, CheckBox, Input, ButtonGroup, Button } from 'react-native-elements'


import AppConstants from '../Constants'


export default class Settings extends React.Component {

    state = {
        selectedIndex: 0
    }

    static navigationOptions = {
        tabBarLabel: AppConstants.STRING_TAB_SETTINGS,
        tabBarIcon: <Icon name= 'settings' />
    }

    updateIndex = (selectedIndex) => {
        this.setState({selectedIndex})
    }

    partOfSpeechAll = () => <Text>All</Text>
    partOfSpeechVerb = () => <Text>Verb</Text>
    partOfSpeechNoun = () => <Text>Noun</Text>
    partOfSpeechAdjective = () => <Text>Adjective</Text>

    render() {

        const buttons = [{ element: this.partOfSpeechAll }, { element: this.partOfSpeechVerb }, { element: this.partOfSpeechNoun }, { element: this.partOfSpeechAdjective }]
        const { selectedIndex } = this.state

        return(
            <View style={styles.container}>
                <CheckBox
                    title= 'Words starting with'
                    checked= {false}
                    right= {true}
                />
                <Input
                    placeholder= 'Enter starting letters'
                    containerStyle={{marginBottom: 16}}
                />
                <CheckBox
                    title= 'Words ending with'
                    checked= {false}
                />
                <Input
                    placeholder= 'Enter ending letters'
                    containerStyle={{marginBottom: 16}}
                />
                <Text style={{marginBottom: 8}}>Part of speech</Text>
                <ButtonGroup
                    onPress={this.updateIndex}
                    buttons={buttons}
                    selectedIndex={selectedIndex}
                    containerStyle={{marginBottom: 16}}
                />
                <Button 
                    title='Clear vocabulary'
                    icon={<Icon name='playlist-remove' type='material-community' color='red'/>}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 8
    },
  });
  