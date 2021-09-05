import React from "react";
import { View, Text, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

export default class Chat extends React.Component {
  state = { messages: [] };

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: this.props.route.params.backgroundColor, borderWidth: 2,
            borderColor: "#FFF", }
        }}
      />
    );
  }

  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.setState({
      messages: [
        {
          _id: 1,
          text: `Hello ${name}!`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native Team",
            avatar: "https://placeimg.com/140/140/any"
          }
        },
        {
          _id: 2,
          text: "This is a system message",
          createdAt: new Date(),
          system: true
        }
      ]
    });
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
          user={{
            _id: 1
          }}
          onSend={messages => this.onSend(messages)}
        />
           { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>
    );
  }
}
