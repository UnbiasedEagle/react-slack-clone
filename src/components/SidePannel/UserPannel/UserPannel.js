import React, { Component } from "react";
import { connect } from "react-redux";
import { auth } from "../../../firebase/firebase";

class UserPannel extends Component {
  state = {};
  render() {
    return (
      <div style={{ color: "#fff" }}>
        <div className="row">
          <div className="col">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "16px",
              }}
              className="text-center"
            >
              <i
                style={{ fontSize: "3rem", marginRight: "8px" }}
                className="fas fa-comments text-white"
              ></i>
              <span
                style={{ fontSize: "1.8rem", fontWeight: "bold" }}
                className="text-white"
              >
                DevChat
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div style={{ margin: "auto" }} className="dropdown mt-2">
            <span
              className="dropdown-toggle"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "8px 0px",
              }}
            >
              <img
                style={{
                  height: "2.8rem",
                  width: "2.8rem",
                  marginRight: "4px",
                  borderRadius: "50%",
                }}
                src={this.props.currentUser && this.props.currentUser.photoURL}
                alt="user"
              />
              <span style={{ cursor: "pointer", fontSize: "1.2rem" }}>
                {this.props.currentUser && this.props.currentUser.displayName}
              </span>
            </span>
            <div className="dropdown-menu">
              <span
                style={{ cursor: "pointer" }}
                className="dropdown-item disabled"
              >
                Signed in as{" "}
                {this.props.currentUser && this.props.currentUser.displayName}
              </span>
              <span style={{ cursor: "pointer" }} className="dropdown-item">
                Change Avatar
              </span>
              <span
                onClick={() => auth.signOut()}
                style={{ cursor: "pointer" }}
                className="dropdown-item"
              >
                Sign Out
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(UserPannel);
