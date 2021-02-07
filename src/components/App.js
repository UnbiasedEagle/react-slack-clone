import React from "react";
import SidePannel from "./SidePannel/SidePannel";
import Messages from "./Messages/Messages";
import "./App.css";

function App() {
  return (
    <div className="row">
      <div className="col-md-3 p-0">
        <SidePannel className="px-3"></SidePannel>
      </div>

      <div className="col-md-9 p-3">
        <Messages></Messages>
      </div>
    </div>
  );
}

export default App;
