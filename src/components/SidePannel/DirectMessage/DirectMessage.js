import React, { Component } from "react";
import { connect } from "react-redux";
import { firestore } from "../../../firebase/firebase";
import {
  setCurrentChannel,
  setPrivateChannel,
} from "../../../redux/channel/channelActions";

class DirectMessage extends Component {
  state = {
    users: [],
  };

  componentDidMount() {
    if (this.props.currentUser) {
      const loadedUsers = [];
      firestore.collection("users").onSnapshot((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const user = doc.data();

          if (this.props.currentUser && doc.id !== this.props.currentUser.uid) {
            user["uid"] = doc.id;
            user["status"] = "offline";
            loadedUsers.push(user);
            this.setState({
              users: loadedUsers,
            });
          }
        });
      });
    }
  }

  changeChannel = (user) => {
    const channelId = this.getChannelId(user.uid);
    const channel = {
      id: channelId,
      name: user.displayName,
    };
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(true);
  };

  getChannelId = (id) => {
    if (this.props.currentUser) {
      return this.props.currentUser.uid > id
        ? `${id}/${this.props.currentUser.uid}`
        : `${this.props.currentUser.uid}/${id}`;
    }
  };

  showUsers = (users) => {
    if (users.length) {
      return (
        <div className="row">
          <div className="col mt-2">
            <ul
              style={{ listStyle: "none", padding: "0 20px" }}
              className="list-group list-group-flush"
            >
              {users.map((user) => {
                return (
                  <li
                    onClick={() => this.changeChannel(user)}
                    className={`list-group-item channel-item  ${
                      this.props.currentChannel &&
                      this.props.currentChannel.id ===
                        this.getChannelId(user.uid)
                        ? "active-channel"
                        : ""
                    }`}
                    style={{
                      color: "grey",
                      fontSize: "1.1rem",
                      cursor: "pointer",
                      backgroundColor: "transparent",
                      width: "100%",
                    }}
                    key={user.uid}
                  >
                    @ {user.displayName}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
  };

  render() {
    const { users } = this.state;
    return (
      <React.Fragment>
        <div style={{ margin: "auto" }} className="row">
          <div className="col">
            <div
              style={{
                padding: "2.8rem 1.6rem 0 1.6rem",
                display: "flex",
                justifyContent: "space-between",
                color: "grey",
                fontSize: "1rem",
              }}
            >
              <span>
                <i
                  style={{ marginRight: "6px" }}
                  className="fas fa-envelope"
                ></i>
                DIRECT MESSAGES
              </span>
            </div>
          </div>
        </div>
        {this.showUsers(users)}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
  };
};

export default connect(mapStateToProps, {
  setCurrentChannel,
  setPrivateChannel,
})(DirectMessage);
