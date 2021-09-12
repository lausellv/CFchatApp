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
    const { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: `${name}` });
  

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
//user is online
   this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
        }
      }),
        // Create reference to the active users messages
        this.referenceMessagesUser = firebase.firestore().collection('messages').where('uid', '==', this.state.uid);
        // Listen for collection changes
        this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
      });
    } else {
      console.log('offline');
      this.setState({ isConnected: false })
    this.props.navigation.setOptions({ title: `${name}'s Chat. Offline` });

      // Calls messeages from offline storage
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
      this.setState({
        messages: []
      })
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
            paddingTop: 30
          }}
        >
          Hello {name}
        </Text>
        <GiftedChat
             messages={this.state.messages}
           renderInputToolbar={this.renderInputToolbar}
           renderBubble={this.renderBubble}
     
          user={this.state.user}
          onSend={messages => this.onSend(messages)}
        />
        {Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    );
  }
}
