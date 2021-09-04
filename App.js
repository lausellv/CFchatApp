import React, { Component } from "react";
("react");
import { Alert, Button, StyleSheet, TextInput, View, Text } from "react-native";

export default class App extends Component {
  state = { text: "" };

  alertMyText(input = []) {
    Alert.alert(input.text);
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          placeholder="Type here ..."
        ></TextInput>
        <Text>You wrote: {this.state.text}</Text>
        <Button
          onPress={() => {
            this.alertMyText({ text: this.state.text });
          }}
          title="Press Me"
        />
      </View>
    );
  }
}
