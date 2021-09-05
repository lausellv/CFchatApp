import React from "react";
import { TextInput, View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";

export default class Start extends React.Component {
  state = { name: "", backgroundColor: "#757083" };
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.imageBackground}
          source={require("../assets/background-image.png")}
        >
          <Text style={styles.title}>Chat App</Text>
          <View>
            <TextInput
              style={styles.nameInput}
              onChangeText={name => this.setState({ name })}
              value={this.state.name}
              placeholder="Your name"
            />
            <Text style={styles.colorText}>Choose Background Color:</Text>
            <View style={styles.backgroundColor}>
              <TouchableOpacity
                style={styles.colorOption1}
                onPress={() => this.setState({ backgroundColor: "#090C08" })}
              />
              <TouchableOpacity
                style={styles.colorOption2}
                onPress={() => this.setState({ backgroundColor: "#474056" })}
              />
              <TouchableOpacity
                style={styles.colorOption3}
                onPress={() => this.setState({ backgroundColor: "#8A95A5" })}
              />
              <TouchableOpacity
                style={styles.colorOption4}
                onPress={() => this.setState({ backgroundColor: "#B9C6AE" })}
              />
            </View>
          </View>
          <TouchableOpacity
            title="Go to Chat"
            style={(styles.startButton, { backgroundColor: this.state.backgroundColor })}
            onPress={() =>
              this.props.navigation.navigate("Chat", {
                name: this.state.name,
                backgroundColor: this.state.backgroundColor
              })
            }
          >
            <Text style={styles.startText}>Let's Chat!</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column", // default
    justifyContent: "center"
  },
  nameInput: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderColor: "#8a8697",
    borderRadius: 2,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    padding: 15
  },

  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    padding: 80,
    margin: 20
  },

  colorText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#757083",
    marginBottom: 10,
    opacity: 50
  },


  startButton: {
    color: "#757083",
    alignItems: "center",
    fontWeight: "300",
    padding: 10
  },

  backgroundColor: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  colorOption1: {
    backgroundColor: "#090C08",
    width: 50,
    height: 50,
    borderRadius: 25
  },

  colorOption2: {
    backgroundColor: "#474056",
    width: 50,
    height: 50,
    borderRadius: 25
  },

  colorOption3: {
    backgroundColor: "#8A95A5",
    width: 50,
    height: 50,
    borderRadius: 25
  },

  colorOption4: {
    backgroundColor: "#B9C6AE",
    width: 50,
    height: 50,
    borderRadius: 25
  },

  startText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 60
  }
});
