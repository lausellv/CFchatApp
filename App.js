import React, { Component } from "react";
// import react native gesture handler
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView, Alert, Button, StyleSheet, TextInput, View, Text } from "react-native";
import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';


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
      <Stack.Navigator
        initialRouteName="Screen1"
      >
        <Stack.Screen
          name="Screen1"
          component={Screen1}
        />
        <Stack.Screen
          name="Screen2"
          component={Screen2}
        />
      </Stack.Navigator>
    </NavigationContainer>
    );
  }
}
