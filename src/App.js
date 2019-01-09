import React, { Component } from "react";
import Snake from "./Snake/index";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Snake />
      </div>
    );
  }
}

export default App;
