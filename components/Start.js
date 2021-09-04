import React from "react";
import { Button, TextInput, View, Text, StyleSheet } from "react-native";

export default class Start extends React.Component {
  state = { NamedNodeMap: "" };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TextInput
          style={styles.inputField}
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
          placeholder="Type in your name"
        />
        <Button
          title="Chat"
          onPress={() => {
            this.props.navigation.navigate("Chat", { text: this.state.name });
          }}
        />
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputField: {
    alignItems: "center",
    width: "88%",
    height: 40,
    color: "#5E6B61",
    fontSize: 16,
    borderColor: "#5E6B61",
    borderWidth: 1
  }
});
