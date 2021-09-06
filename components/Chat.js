import React from "react";
import { View, Text, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

import firebase from 'firebase';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Keep message initial state empty
      messages: [],
      uid: 0,
      loggedInText: "Logging in...",
      user: {
        _id: "",
        name: ""
      }
    };
    // configuring firebase
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
    this.referenceMessageUser = null;
  }

  componentDidMount() {
    const { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: `${name}` });

    // authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }

      // Update user state with active user
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name
        }
      });
      this.referenceMessagesUser = firebase
        .firestore()
        .collection("messages")
        .where("uid", "==", this.state.uid);

      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  // Add messages to database
  addMessages() {
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text,
      user: message.user
    });
  }

  onCollectionUpdate = querySnapshot => {
    const messages = [];
    // go through each document
    querySnapshot.forEach(doc => {
      // get the QueryDocumentSnapshot's data
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name
        }
      });
    });
    this.setState({
      messages
    });
  };

  onSend = (messages = []) => {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      // Make sure to call addMessages so they get saved to the server
      () => {
        this.addMessages();
      }
    );
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: this.props.route.params.backgroundColor,
            borderWidth: 2,
            borderColor: "#FFF"
          }
        }}
      />
    );
  }

  render() {
    //let name = this.props.route.params.name; // OR ...
    let { name, backgroundColor } = this.props.route.params;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{ flex: 1, backgroundColor: backgroundColor }}>
        {/* Rest of the UI */}
        <Text
          style={{
            fontSize: 26,
            fontWeight: "600",
            color: "#FFF",
            textAlign: "center",
            lineHeight: 60,
            paddingTop: 90
          }}
        >
          Hello {name}
        </Text>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          user={this.state.user.name}
          onSend={messages => this.onSend(messages)}
        />
        {Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
}
