import React, { Component } from "react";
// import react native gesture handler
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView, Alert, Button, StyleSheet, TextInput, View, Text } from "react-native";
import Chat from './components/Chat';
import Start from './components/Start';


// Create the navigator
const Stack = createStackNavigator();
export default class App extends Component {
  state = { text: "" };

  alertMyText(input = []) {
    Alert.alert(input.text);
  }

  render() {
    return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
    );
  }
}
