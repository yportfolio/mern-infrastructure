import React, { Component } from "react";
import { hot } from "react-hot-loader";

export class HelloWorld extends Component {
  render() {
    return (
      <div>
        <h1>Hello</h1>
      </div>
    );
  }
}

export default hot(module)(HelloWorld);
