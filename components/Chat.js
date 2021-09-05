import React from 'react';
import { View, Text } from 'react-native';

export default class Chat extends React.Component {

  render() {
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{ flex:1, backgroundColor: this.props.route.params.backgroundColor}}>
        {/* Rest of the UI */}
        <Text style={{ fontSize: 26,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 60,
    paddingTop: 90}}>Hello {name}</Text>
      </View>
    );
  };
}