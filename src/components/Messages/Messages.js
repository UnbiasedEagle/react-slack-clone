import React, { Component } from "react";

import { database } from "../../firebase/firebase";
import MessageForm from "./MessageForm/MessageForm";
import MessagesHeader from "./MessagesHeader/MessagesHeader";
import "./Messages.css";
import { connect } from "react-redux";
import Message from "./Message/Message";

class Messages extends Component {
  messagesEndRef = React.createRef();
  state = {
    messagesRef: database.ref("messages"),
    messages: [],
    messagesLoaded: false,
    searchTerm: "",
    searchResults: [],
    loadingSearchResults: false,
  };

  addListeners = (channelId) => {
    this.addMessageListeners(channelId);
  };

  scrollToBottom = () => {
    if (this.messagesEndRef.current) {
      this.messagesEndRef.current.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: "smooth",
        alignToTop: false,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.currentChannel !== prevProps.currentChannel) {
      this.addListeners(this.props.currentChannel.id);
    }
    return true;
  }

  addMessageListeners = (channelId) => {
    const loadedMessages = [];
    const { messagesRef } = this.state;
    const ref = this.props.isPrivateChannel
      ? database.ref("privateMessages")
      : messagesRef;
    let messageAdded = false;

    ref.child(channelId).on("child_added", (snap) => {
      if (channelId === this.props.currentChannel.id) {
        loadedMessages.push(snap.val());
        messageAdded = true;
        this.setState(
          {
            messages: loadedMessages,
            messagesLoaded: false,
          },
          () => this.scrollToBottom()
        );
      }
    });

    if (!messageAdded) {
      this.setState({
        messages: [],
        messagesLoaded: false,
      });
    }
  };

  displayMessages = (messages) => {
    if (messages.length) {
      return messages.map((message, idx) => {
        return (
          <React.Fragment key={idx}>
            <Message
              message={message}
              user={this.props.currentUser}
              timestamp={message.timestamp}
            ></Message>
            <div ref={this.messagesEndRef} />
          </React.Fragment>
        );
      });
    } else {
      return null;
    }
  };

  getChannelName = () => {
    if (this.props.currentChannel && this.props.isPrivateChannel) {
      return `@ ${this.props.currentChannel.name}`;
    } else if (this.props.currentChannel) {
      return `# ${this.props.currentChannel.name}`;
    }
  };

  getUniqueUsers = (messages) => {
    let uniqueUsersCount = 0;
    const uniqueUsers = [];
    messages.forEach((message) => {
      if (!uniqueUsers.includes(message.user.id)) {
        uniqueUsersCount++;
        uniqueUsers.push(message.user.id);
      }
    });
    return uniqueUsersCount;
  };

  handleSearchTermChange = (e) => {
    this.setState(
      {
        searchTerm: e.target.value,
        loadingSearchResults: true,
      },
      () => {
        this.handleSearchResults();
      }
    );
  };

  handleSearchResults = () => {
    const loadedMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = loadedMessages.reduce((acc, curr) => {
      if (
        (curr.content && curr.content.match(regex)) ||
        curr.user.name.match(regex)
      ) {
        acc.push(curr);
      }
      return acc;
    }, []);
    this.setState({
      searchResults,
    });
    setTimeout(() => this.setState({ loadingSearchResults: false }), 1000);
  };

  render() {
    const {
      messagesRef,
      messages,
      searchTerm,
      searchResults,
      loadingSearchResults,
    } = this.state;

    return (
      <React.Fragment>
        <div className="messages-container">
          <MessagesHeader
            searchTerm={searchTerm}
            isPrivateChannel={this.props.isPrivateChannel}
            handleSearchTermChange={this.handleSearchTermChange}
            users={this.getUniqueUsers(messages)}
            channelName={this.getChannelName()}
            loadingSearchResults={loadingSearchResults}
          ></MessagesHeader>

          <div className="messages my-3">
            <div
              style={{ height: "100%", overflowY: "scroll" }}
              className="card"
            >
              {searchTerm
                ? this.displayMessages(searchResults)
                : this.displayMessages(messages)}
            </div>
          </div>

          <MessageForm
            isPrivateChannel={this.props.isPrivateChannel}
            messagesRef={messagesRef}
          ></MessageForm>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentChannel: state.channel.currentChannel,
    currentUser: state.user.currentUser,
    isPrivateChannel: state.channel.isPrivateChannel,
  };
};

export default connect(mapStateToProps)(Messages);
