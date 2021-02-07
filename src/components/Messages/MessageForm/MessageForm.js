import React, { Component } from "react";
import firebase from "../../../firebase/firebase";
import { connect } from "react-redux";
import "./MessageForm.css";
import FileModal from "./FileModal";
import { v4 as uuidv4 } from "uuid";

class MessageForm extends Component {
  state = {
    message: "",
    loading: false,
    errors: [],
    modal: false,
    storageRef: firebase.storage().ref(),
    uploadState: "",
    uploadTask: null,
    progress: 0,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  createMessage = (fileURL = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        avatar: this.props.currentUser.photoURL,
        name: this.props.currentUser.displayName,
        id: this.props.currentUser.uid,
      },
    };
    if (fileURL) {
      message["image"] = fileURL;
    } else {
      message["content"] = this.state.message;
    }

    return message;
  };

  sendMessage = () => {
    const { currentChannel } = this.props;

    const { message } = this.state;
    if (message) {
      this.setState({
        loading: true,
      });
      const ref = this.getMessageRef();
      ref
        .child(currentChannel.id)
        .push()
        .set(this.createMessage())
        .then(() =>
          this.setState({
            message: "",
            loading: false,
          })
        )
        .catch((err) => {
          console.log(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err),
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" }),
      });
    }
  };

  isInputValid = (errors, inputName) => {
    return errors.some((err) => err.message.toLowerCase().includes(inputName))
      ? "is-invalid"
      : "";
  };

  modalOpen = () => {
    this.setState({
      modal: true,
    });
  };

  modalClose = () => {
    this.setState({
      modal: false,
    });
  };

  getFilePath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.props.currentChannel.id}`;
    }
    return `chat/public`;
  };

  getMessageRef = () => {
    if (this.props.isPrivateChannel) {
      return firebase.database().ref("privateMessages");
    }
    return this.props.messagesRef;
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.props.currentChannel.id;
    const ref = this.getMessageRef();
    const filePath = `${this.getFilePath()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          (snap) => {
            const progress = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({
              progress,
            });
          },
          (err) => {
            console.log(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null,
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadURL) => {
                this.sendImageMessage(downloadURL, ref, pathToUpload);
              })
              .then(() => {
                this.setState({
                  uploadState: "done",
                });
              })
              .catch((err) => {
                console.log(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                });
              });
          }
        );
      }
    );
  };

  sendImageMessage = (fileURL, ref, pathToUpload) => {
    ref.child(pathToUpload).push().set(this.createMessage(fileURL));
  };

  render() {
    const {
      message,
      errors,
      loading,
      modal,
      progress,
      uploadState,
    } = this.state;

    return (
      <React.Fragment>
        <div className="message-form">
          <div className="card p-2">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  <i className="fas fa-plus"></i>
                </span>
              </div>
              <input
                className={`form-control ${this.isInputValid(
                  errors,
                  "message"
                )}`}
                type="text"
                name="message"
                value={message}
                onChange={this.handleChange}
                placeholder="Write your message"
              />
            </div>
            <div className="message-form__buttonsContainer">
              <button
                disabled={loading}
                onClick={this.sendMessage}
                className="btn btn-warning"
              >
                <i className="fas fa-edit"></i>
                <span>Add Reply</span>
              </button>
              <button
                disabled={uploadState === "uploading"}
                onClick={this.modalOpen}
                data-toggle="modal"
                data-target="#mediaModal"
                className="btn btn-success"
              >
                <span> Upload Media</span>
                <i className="fas fa-cloud-upload-alt"></i>
              </button>
            </div>
            {uploadState === "uploading" && (
              <div
                style={{ height: "2rem", marginTop: "1rem" }}
                className="progress"
              >
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            )}
          </div>
        </div>
        {modal && (
          <FileModal
            uploadFile={this.uploadFile}
            modalClose={this.modalClose}
          ></FileModal>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentChannel: state.channel.currentChannel,
    currentUser: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(MessageForm);
