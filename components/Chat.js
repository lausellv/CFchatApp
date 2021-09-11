import React from "react";
//Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import { View, Text, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";

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
      },
      isConnected: false,
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
    const { name , backgroundColor} = this.props.route.params;
  

    // is user online?
    NetInfo.fetch().then(connection =>{
      if (connection.isConnected){
        this.props.navigation.setOptions({ title: `${name} is online` });
        this.setState({isConnected: true});
         // authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      const shuffled = user.uid.split('').sort(function(){return 0.5-Math.random()}).join('');
      this.setState({
        uid: user.uid,
        user: {
          _id: user.uid,
          name: username,
        },

        messages: [{
          _id: shuffled,
          text: `Welcome to the chat ${name}`,
          createdAt: new Date(),
         },
      ],
      isConnected: true
      });
      this.addMessages()
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  } else {
    this.props.navigation.setOptions({ title: `${name}'s Chat. Offline` });
    this.setState({ isConnected: false });
    this.getMessages();
  }
    
    });
   }

   componentWillUnmount() {
    this.authUnsubscribe();
    this.authUnsubscribe();
  }

  // Add messages to database
  addMessages() {
    const message = this.state.messages[0];
    
    // add new messages to collection
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

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }


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

  renderInputToolbar = (props) => {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />
    }
  }

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
          left:{
            backgroundColor: "#c7c7c7",
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


    return (
      <View style={{ flex: 1, backgroundColor: backgroundColor }}>
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
           renderInputToolbar={this.renderInputToolbar}
           renderBubble={this.renderBubble}
          messages={this.state.messages}
          user={this.state.user}
          onSend={messages => this.onSend(messages)}
        />
        {Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
}
