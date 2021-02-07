import React from "react";
import moment from "moment";
import "./Message.css";

const Message = ({ message, timestamp, user }) => {
  return (
    <div className="media mt-3">
      <img
        style={{ height: "60px" }}
        src={message.user.avatar}
        className="mr-3"
        alt="user"
      />
      <div
        className={`media-body ${
          user && user.uid === message.user.id ? "message__self" : ""
        }`}
      >
        <div style={{ display: "flex" }}>
          <h5 className="mt-0">{message.user.name}</h5>
          <p style={{ color: "grey", marginLeft: "6px" }}>
            {moment(timestamp).fromNow()}
          </p>
        </div>

        {message.image && !message.content ? (
          <img className="img-fluid" src={message.image} alt="message" />
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
};

export default Message;
