import React, { Component } from "react";
("react");
import { StyleSheet, TextInput, View } from "react-native";

export default class HelloWorld extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box1}></View>
        <View style={styles.box2}></View>
        <View style={styles.box3}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: "column" by default
   },
  box1: { flex: 1, backgroundColor: "#efb5a3" },
  box2: { flex: 2, backgroundColor: "#f57e7e" },
  box3: { flex: 3, backgroundColor: "#315f72" }
});
