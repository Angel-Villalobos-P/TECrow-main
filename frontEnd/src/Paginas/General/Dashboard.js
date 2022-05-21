import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import fire from "../../fire.js";

import axios from "axios";
import CardDashboard from "../../Componentes/Card/CardDashboard";

//Images used for test
import grupos from "../../assets/grupos.jpg";
import trivias from "../../assets/trivias.jpg";
import juegos from "../../assets/juegos.jpg";

class Dashboard extends Component {
  state = {
    tipoUsuario: "Profesor",
    idUsuario: null,
    cantidadGrupos: 0,
    grupos: [],
    cantidadTrivias: 0,
    cantidadJuegos: 0,
    url: "https://www.youtube.com/watch?v=XqZsoesa55w",
  };

  verOpcionTrivia() {
    if (this.state.tipoUsuario === "Profesor")
      return (
        <div className="col-md-4" key={1}>
          <Link to="/Trivias" style={{ textDecoration: "none" }}>
            <CardDashboard
              imageSource={trivias}
              titulo="Trivias"
              descripcion="Aquí puedes consultar todas las trivias que has creado con sus respectivas preguntas."
              url={"/trivias"}
              cantidad={this.state.cantidadTrivias + " Trivias"}
              imageHeight={"300rem"}
            />
          </Link>
        </div>
      );
    else return <></>;
  }

  componentDidMount() {
    var self = this;
    axios.get("/obtenerInformacionHeader").then(function (res) {
      self.setState({
        tipoUsuario: res.data.tipoUsuario,
        idUsuario: res.data.correoElectronico,
      });
    });
    this.cargarGrupos();
    if (this.state.tipoUsuario === "Profesor") this.cargarTrivias();
  }

  cargarGrupos() {
    var self = this;
    axios
      .post("/extraerGrupos", {
        pIdUsuario: self.state.idUsuario,
      })
      .then(function (res) {
        if (res.data !== []) {
          self.setState({ cantidadGrupos: res.data.length, grupos: res.data });
          self.cargarJuegos();
        }
      });
  }

  cargarTrivias() {
    var self = this;
    axios
      .post("/extraerTrivias", {
        pIdUsuario: this.state.idUsuario,
      })
      .then(function (res) {
        if (res.data !== []) {
          self.setState({ cantidadTrivias: res.data.length });
        }
      });
  }

  cargarJuegos() {
    var self = this;
    axios
      .post("/extraerJuegos", {
        pGrupos: self.state.grupos,
      })
      .then(function (res) {
        if (res.data !== []) {
          self.setState({ cantidadJuegos: res.data.length });
        }
      });
  }

  onChange = (e) =>
    this.setState({
      [e.target.name]: e.target.value,
    });

  render() {
    var cantidadGrupos = this.state.cantidadGrupos;
    var cantidadJuegos = this.state.cantidadJuegos;
    var color =
      this.state.tipoUsuario === "Profesor"
        ? { color: "#006c7e" }
        : { color: "#002a59" };
    return (
      <div>
        <Container>
          <div className="d-flex flex-row bd-highlight mb-3">
            <h1
              style={{ padding: 0, margin: "1em 0 0 0", color: "#002A59" }}
              className="d-flex justify-content-start"
            >
              {this.state.tipoUsuario === "Profesor"
                ? "Dashboard profesor"
                : "Dashboard estudiante"}
            </h1>
          </div>
          <div className="container mt-3"></div>

          <hr
            style={{
              color: "#000000",
              backgroundColor: "#000000",
              height: 0.5,
              borderColor: "#000000",
              border: 3,
              padding: 0,
            }}
          />
        </Container>
        <Container className="grid justify-content-center align-items-center">
          <div className="row">
            <div className="col-md-4" key={0}>
              <Link to="/Grupos" style={{ textDecoration: "none" }}>
                <CardDashboard
                  imageSource={grupos}
                  titulo="Grupos"
                  descripcion={
                    this.state.tipoUsuario === "Profesor"
                      ? "Aquí puedes consultar la información de todos tus grupos."
                      : "Aquí puedes consultar la información de todos los grupos a los que perteneces."
                  }
                  cantidad={cantidadGrupos + " Grupos"}
                  url={"/grupos"}
                  imageHeight={"300rem"}
                />
              </Link>
            </div>
            {this.verOpcionTrivia()}
            <div className="col-md-4" key={2}>
              <Link
                to={
                  this.state.tipoUsuario === "Profesor" ? "/Juego" : "/JuegosE"
                }
                style={{ textDecoration: "none" }}
              >
                <CardDashboard
                  imageSource={juegos}
                  titulo="Juegos"
                  descripcion={
                    this.state.tipoUsuario === "Profesor"
                      ? "Aquí puedes consultar la información de todos los juegos asociados a ti, abiertos o cerrados."
                      : "Aquí puedes consultar la información de los juegos en los que has participado, abiertos o cerrados"
                  }
                  url={"/juego"}
                  cantidad={cantidadJuegos + " Juegos"}
                  imageHeight={"300rem"}
                />
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
