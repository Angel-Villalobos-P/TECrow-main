import React, { Component } from "react";
import logo from "../../../Crow(Principal).PNG";
import "./Principal.css";
import Header from "../Header";

class Principal extends Component {
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <div>
        <Header></Header>
        <h1>Página principal</h1>
        <img src={logo} width="500" height="500" alt="100" />
      </div>
    );
  }
}

export default Principal;
