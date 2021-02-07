import React, { Component } from "react";
import Channels from "./Channels/Channels";
import DirectMessage from "./DirectMessage/DirectMessage";
import UserPannel from "./UserPannel/UserPannel";

class SidePannel extends Component {
  state = {};
  render() {
    return (
      <div
        style={{ width: "100%", height: "100vh", backgroundColor: "#4c3c4c" }}
      >
        <UserPannel></UserPannel>
        <Channels></Channels>
        <DirectMessage></DirectMessage>
      </div>
    );
  }
}

export default SidePannel;
