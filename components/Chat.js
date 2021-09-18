import React from "react";
//Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import CustomActions from "./CustomActions";

import { View, Text, Platform, KeyboardAvoidingView, LogBox } from "react-native";
import MapView from "react-native-maps";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";

import firebase from "firebase";
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Keep message initial state empty
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: ""
      },
      isConnected: false,
      image: null,
      location: null
    };
    // connect to firebase
    const firebaseConfig = {
      apiKey: "AIzaSyDtBTG6ijl6nGx3EdUtsT_jtCJfRUsaSWU",
      authDomain: "cf53test.firebaseapp.com",
      projectId: "cf53test",
      storageBucket: "cf53test.appspot.com",
      messagingSenderId: "576394065211",
      appId: "1:576394065211:web:e3136b8809f395656e331e",
      measurementId: "G-WQRNK0X6JH"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.referenceChatMessages = firebase.firestore().collection("messages");
    //ignores the setting a timer warning
    LogBox.ignoreLogs(["Setting a timer", "Animated.event", "expo-permissions", "useNativeDriver"]);
  }

  componentDidMount() {
    const { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: `${name}` });

    // is user online?
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.props.navigation.setOptions({ title: `${name} is online` });
        this.setState({ isConnected: true });
        // authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(user => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          //user is online
          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user.uid,
              name: name
            }
          }),
            // Create reference to the active users messages
            (this.referenceMessagesUser = firebase
              .firestore()
              .collection("messages")
              .where("uid", "==", this.state.uid));
          // Listen for collection changes
          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log("offline");
        this.setState({ isConnected: false });
        this.props.navigation.setOptions({ title: `${name}'s Chat. Offline` });

        // Calls messeages from offline storage
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
    this.referenceChatMessages = () => {};
  }

  // Add messages to database
  async addMessages() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      createdAt: message.createdAt,
      image: message.image || null,
      location: message.location || null,
      text: message.text || null,
      user: message.user
    });
  }

  // get msgs from AsyncStorage
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //Save msgs to LS
  async saveMessages() {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // delete messages from AsyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: []
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  onSend = (messages = []) => {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      // Calls addMessages and saves to server
      () => {
        this.addMessages();
        // uses local storage to save messages
        this.saveMessages();
      }
    );
  };

  onCollectionUpdate = querySnapshot => {
    const messages = [];
    // go through each document
    querySnapshot.forEach(doc => {
      // get the QueryDocumentSnapshot's data
      const data = doc.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        image: data.image || null,
        location: data.location || null,
        text: data.text,
        user: data.user
      });
    });
    this.setState({
      messages
    });
  };

  // when online no input can be entered
  renderInputToolbar = props => {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#a3a3a3",
            borderWidth: 2,
            borderColor: "#FFF"
          },
          left: {
            backgroundColor: "#c7c7c7",
            borderWidth: 2,
            borderColor: "#FFF"
          }
        }}
      />
    );
  }

  renderCustomActions = props => {
    return <CustomActions {...props} />;
  };

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.922,
            longitudeDelta: 0.0421
          }}
        />
      );
    }
    return null;
  }

  render() {
    //let name = this.props.route.params.name; // OR ...
    let { name, backgroundColor, text } = this.props.route.params;
    this.props.navigation.setOptions({ title: text });

    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: backgroundColor }}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "600",
            color: "#FFF",
            textAlign: "center",
            lineHeight: 60,
            paddingTop: 10
          }}
        >
          Hello {name}
        </Text>
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderBubble={this.renderBubble.bind(this)}
          renderCustomView={this.renderCustomView}
          renderActions={this.renderCustomActions}
          isConnected={this.state.isConnected}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
        {Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
}
