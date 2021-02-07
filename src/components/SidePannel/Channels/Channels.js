import React, { Component } from "react";
import { database } from "../../../firebase/firebase";
import { connect } from "react-redux";
import {
  setCurrentChannel,
  setPrivateChannel,
} from "../../../redux/channel/channelActions";
import "./Channel.css";

class Channels extends Component {
  state = {
    channels: [],
    channelName: "",
    channelDetails: "",
    showModal: false,
    firstLoad: true,
    channel: null,
    notifications: [],
    messageRef: database.ref("messages"),
  };

  componentDidMount() {
    const loadedChannels = [];
    database.ref("channels").on("child_added", (snap) => {
      loadedChannels.push(snap.val());
      this.addNotificationListener(snap.key);
      this.setState(
        {
          channels: loadedChannels,
        },
        () => {
          if (this.state.firstLoad && this.state.channels.length) {
            this.props.setCurrentChannel(this.state.channels[0]);
          }
          this.setState(
            {
              firstLoad: false,
              channel: this.state.channels[0],
            },
            () => {
              this.clearNotifications();
            }
          );
        }
      );
    });
  }

  addNotificationListener = (channelId) => {
    this.state.messageRef.child(channelId).on("value", (snap) => {
      this.handleNotification(
        channelId,
        this.state.channel,
        this.state.notifications,
        snap
      );
    });
  };

  handleNotification = (channelId, currentChannel, notifications, snap) => {
    let lastTotal = 0;

    let updatedNotifications = [...notifications];

    const idx = notifications.findIndex(
      (notification) => notification.id === channelId
    );

    if (idx !== -1) {
      if (currentChannel !== channelId) {
        lastTotal = updatedNotifications[idx].total;
        if (snap.numChildren() - lastTotal > 0) {
          updatedNotifications[idx].count = snap.numChildren() - lastTotal;
        }
        updatedNotifications[idx].lastKnowTotal = lastTotal;
      }
    } else {
      updatedNotifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnowTotal: snap.numChildren(),
        count: 0,
      });
    }

    this.setState(
      {
        notifications: updatedNotifications,
      },
      () => {
        this.clearNotifications();
      }
    );
  };

  componentWillUnmount() {
    database.ref("channels").off();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  modalOpen = () => {
    this.setState({
      showModal: true,
    });
  };

  modalClose = () => {
    this.setState({
      showModal: false,
    });
  };

  addChannel = () => {
    const { channelName, channelDetails } = this.state;
    const channelRef = database.ref("channels");
    const key = channelRef.push().key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: this.props.currentUser.displayName,
        avatar: this.props.currentUser.photoURL,
      },
    };
    channelRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({
          channelDetails: "",
          channelName: "",
        });
        this.modalClose();
        console.log("Channel Created");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  isFormValid = ({ channelName, channelDetails }) => {
    return channelName && channelDetails;
  };

  changeChannel = (channel) => {
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel }, () => this.clearNotifications());
  };

  clearNotifications = () => {
    if (this.state.channel) {
      const idx = this.state.notifications.findIndex(
        (notification) => notification.id === this.state.channel.id
      );

      if (idx !== -1) {
        const notifications = [...this.state.notifications];
        notifications[idx].total = notifications[idx].lastKnowTotal;
        notifications[idx].count = 0;
        this.setState({
          notifications,
        });
      }
    }
  };

  displayNotifications = (channelId) => {
    let count = 0;

    this.state.notifications.forEach((notification) => {
      if (notification.id === channelId) {
        count = notification.count;
      }
    });
    if (count > 0) {
      return <span className="badge badge-danger">{count}</span>;
    }
    return null;
  };

  showChannels = (channels) => {
    if (channels.length) {
      return (
        <div className="row">
          <div className="col mt-2">
            <ul
              style={{ listStyle: "none", padding: "0 20px" }}
              className="list-group list-group-flush"
            >
              {channels.map((channel) => {
                return (
                  <li
                    className={`list-group-item channel-item  ${
                      this.props.currentChannel &&
                      this.props.currentChannel.id === channel.id
                        ? "active-channel"
                        : ""
                    }`}
                    onClick={() => this.changeChannel(channel)}
                    style={{
                      color: "grey",
                      fontSize: "1.1rem",
                      cursor: "pointer",
                      backgroundColor: "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    key={channel.id}
                  >
                    <span>#{channel.name}</span>
                    {this.displayNotifications(channel.id)}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
    return;
  };

  render() {
    const { channels, channelName, channelDetails, showModal } = this.state;
    return (
      <React.Fragment>
        <div style={{ color: "grey", margin: "auto" }} className="row mt-3">
          <div style={{ fontSize: "1rem" }} className="col">
            <div
              style={{
                padding: "0 1.8rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                <i
                  style={{ marginRight: "6px" }}
                  className="fas fa-exchange-alt"
                ></i>
                CHANNELS ({channels.length})
              </span>
              <button
                onClick={this.modalOpen}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  color: "grey",
                  outline: "none",
                }}
                type="button"
                data-toggle="modal"
                data-target="#channelModal"
              >
                <i
                  style={{ pointerEvents: "none" }}
                  className="fas fa-plus"
                ></i>
              </button>
            </div>
          </div>
        </div>
        {this.showChannels(channels)}
        {showModal && (
          <div
            className="modal fade"
            id="channelModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Add Channel
                  </h5>
                  <button
                    onClick={this.modalClose}
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">
                          Name of Channel
                        </span>
                      </div>
                      <input
                        type="text"
                        value={channelName}
                        onChange={this.handleChange}
                        name="channelName"
                        className="form-control"
                      />
                    </div>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">
                          About the Channel
                        </span>
                      </div>
                      <input
                        type="text"
                        value={channelDetails}
                        onChange={this.handleChange}
                        name="channelDetails"
                        className="form-control"
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    onClick={this.handleSubmit}
                    type="button"
                    className="btn btn-success"
                    data-dismiss="modal"
                  >
                    <i
                      style={{ marginRight: "4px" }}
                      className="fas fa-check"
                    ></i>
                    Add
                  </button>
                  <button
                    onClick={this.modalClose}
                    type="button"
                    data-dismiss="modal"
                    aria-label="Close"
                    className="btn btn-danger"
                  >
                    <i
                      style={{ marginRight: "4px" }}
                      className="fas fa-times"
                    ></i>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
})(Channels);
