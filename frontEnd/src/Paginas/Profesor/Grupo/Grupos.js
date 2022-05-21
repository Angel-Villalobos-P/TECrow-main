import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Grupos.css";

import Card from "../../../Componentes/Card/CardGrupo.js";
import CardAgregar from "../../../Componentes/Card/CardAgregar.js";

import axios from "axios";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Container,
  Col,
  Row,
} from "reactstrap";

//icon imports
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faLockOpen } from "@fortawesome/free-solid-svg-icons";
//fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import GrupoDefaultImage from "./GrupoDefaultImage.png";
class Grupos extends Component {
  state = {
    sesionIniciada: false,
    esProfesor: false,
  };

  componentDidMount() {
    var self = this;
    axios.get("/obtenerInformacionHeader").then(function (res) {
      if (res.data.sesionIniciada === true)
        self.setState({
          sesionIniciada: true,
          esProfesor: res.data.tipoUsuario === "Profesor" ? true : false,
        });
      else self.setState({ sesionIniciada: false });
    });
  }
  constructor(props) {
    super(props);
    this.changeDisplay = this.changeDisplay.bind(this);
    this.state = {
      tipo: "Grupos Abiertos",
      icono: faLock,
      msg: "Abierto",
      idUsuario: "admin@gmail.com",
      grupos: [],
    };

    this.cargarGrupos();
  }

  cargarGrupos() {
    var self = this;
    axios.post("/extraerGrupos").then(function (res) {
      if (res.data !== []) {
        self.setState({ grupos: res.data });
      }
    });
  }

  changeDisplay() {
    if (this.state.tipo === "Grupos Cerrados") {
      this.setState({
        tipo: "Grupos Abiertos",
        icono: faLock,
        msg: "Abierto",
      });
    } else {
      this.setState({
        tipo: "Grupos Cerrados",
        icono: faLockOpen,
        msg: "Cerrado",
      });
    }
  }

  onChange = (e) =>
    this.setState({
      [e.target.name]: e.target.value,
    });

  render() {
    const estadoCards = this.state.msg;
    let displayCards;
    if (estadoCards === "Abierto") {
      displayCards = this.state.grupos.filter(
        (element) => element.estado === true
      );
    } else {
      displayCards = this.state.grupos.filter(
        (element) => element.estado === false
      );
    }

    return (
      <>
        <Container className="my-5">
          <div className="row justify-content-start">
            <div className="col-1">
              <Link className="link" to="/dashboard">
                <FontAwesomeIcon
                  className="homeLink"
                  icon={faArrowCircleLeft}
                  size="2x"
                />
              </Link>
            </div>
            <div className="col-6 text-start">
              <h3>{this.state.tipo} </h3>
            </div>
            <a
              onClick={this.changeDisplay}
              className="lockDisplay col-md-1 offset-md-4"
            >
              <FontAwesomeIcon icon={this.state.icono} size="2x" />
            </a>
          </div>

          <hr
            style={{
              color: "#000000",
              backgroundColor: "#000000",
              height: 0.5,
              borderColor: "#000000",
              border: 3,
            }}
          />

          <div className="container grid justify-content-center align-items-center">
            <div className="row">
              {this.state.esProfesor ? (
                <div className="col-md-4">
                  <Link to={"/crearGrupo"} style={{ textDecoration: "none" }}>
                    <CardAgregar seccion={"Crear Grupo"} />
                  </Link>
                </div>
              ) : (
                <div className="col-md-4">
                  <Link to={"/UnionGrupo"} style={{ textDecoration: "none" }}>
                    <CardAgregar
                      seccion={
                        "Incorporarse a un nuevo grupo mediante un código"
                      }
                    />
                  </Link>
                </div>
              )}
              {displayCards.map(
                ({ _id, imagen, nombre, juegos, estudiantes }) => (
                  <div className="col-md-4" key={_id}>
                    <Link
                      to={"/VerGrupo/" + _id}
                      style={{ textDecoration: "none" }}
                    >
                      <Card
                        className="cardGrupo"
                        id={_id}
                        imagen={imagen === "" ? GrupoDefaultImage : imagen}
                        nombre={nombre}
                        juegos={juegos.length}
                        estudiantes={estudiantes.length}
                      />
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </Container>
      </>
    );
  }
}

export default Grupos;
