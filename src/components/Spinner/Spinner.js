import React from "react";

const Spinner = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#333",
        color: "#fff",
      }}
    >
      <div
        style={{ height: "4rem", width: "4rem" }}
        className="spinner-border"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <h3 className="mt-3">Preparing Chats...</h3>
    </div>
  );
};

export default Spinner;
