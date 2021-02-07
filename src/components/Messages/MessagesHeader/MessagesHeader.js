import React, { Component } from "react";
import "./MessagesHeader.css";

class MessagesHeader extends Component {
  state = {};
  render() {
    const {
      channelName,
      users,
      searchTerm,
      handleSearchTermChange,
      loadingSearchResults,
      isPrivateChannel,
    } = this.props;
    return (
      <div className="message-header__container">
        <div className="card p-4">
          <div className="messages-header">
            <div className="messages-header__channelDetails">
              <span className="messages-header__channelName">
                {channelName}
                {!isPrivateChannel && <i className="far fa-star"></i>}
              </span>
              {users >= 1 && (
                <span className="messages-header__users">
                  {users} {users > 1 ? "users" : "user"}
                </span>
              )}
            </div>
            <div className="messages-header__formContainer">
              <div className="messages-header__form">
                <input
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  placeholder="Search Messages"
                  type="text"
                  className="form-control"
                />
                {loadingSearchResults ? (
                  <div
                    style={{ height: "20px", width: "20px" }}
                    className="spinner-border"
                    role="status"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  <i className="fas fa-search mr-2"></i>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MessagesHeader;
