import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./Juego.css";
import axios from "axios";

//icon imports
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { faLockOpen } from "@fortawesome/free-solid-svg-icons";

//fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Component Card
import CardAgregar from "../../../Componentes/Card/CardAgregar.js";
import CardJuego from "../../../Componentes/Card/CardJuego";

import { Container, Col, Row, Spinner } from "reactstrap";

class Juego extends Component {
  constructor(props) {
    super(props);
    this.changeDisplay = this.changeDisplay.bind(this);
    this.state = {
      tipo: "Juegos Abiertos",
      icono: faLock,
      msg: "Abierto Hasta",
      juegos: [],
      esProfesor: null,
      grupos: [],
      loading: false,
    };
  }

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
    this.cargarGrupos();
  }

  async cargarGrupos() {
    var self = this;
    await axios
      .post("/extraerGrupos", {
        pIdUsuario: self.state.idUsuario,
      })
      .then(function (res) {
        if (res.data !== []) {
          self.setState({ cantidadGrupos: res.data.length, grupos: res.data });
          self.cargarJuegos();
        }
        self.setState({ loading: true });
      });
  }

  cargarJuegos() {
    var self = this;
    axios
      .post("/extraerJuegos", {
        pGrupos: self.state.grupos,
      })
      .then(function (res) {
        /* console.log(res.data) */
        if (res.data !== []) {
          self.setState({ juegos: res.data });
        }
      });
  }

  changeDisplay() {
    if (this.state.tipo === "Juegos Cerrados") {
      this.setState({
        tipo: "Juegos Abiertos",
        icono: faLock,
        msg: "Abierto Hasta",
      });
    } else {
      this.setState({
        tipo: "Juegos Cerrados",
        icono: faLockOpen,
        msg: "Cerrado Desde",
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

    if (estadoCards === "Abierto Hasta") {
      displayCards = this.state.juegos.filter(
        (element) => element.estado === true
      );
    } else {
      displayCards = this.state.juegos.filter(
        (element) => element.estado === false
      );
    }

    return (
      <>
        <Container className="my-5">
          <Row>
            <Container style={{ display: "inline-flex" }}>
              <Link
                className="link"
                to="/dashboard"
                style={{ marginRight: "1em" }}
              >
                <FontAwesomeIcon
                  className="homeLink"
                  icon={faArrowCircleLeft}
                  size="2x"
                />
              </Link>
              <Col xs="11" className="text-start">
                <h3>{this.state.tipo}</h3>
              </Col>
              <a onClick={this.changeDisplay} xs="1">
                <FontAwesomeIcon
                  icon={this.state.icono}
                  className="lockDisplay"
                  size="2x"
                />
              </a>
            </Container>
          </Row>

          <hr
            style={{
              color: "#000000",
              backgroundColor: "#000000",
              height: 0.5,
              borderColor: "#000000",
              border: 3,
            }}
          />
          {!this.state.loading ? (
            <Row className="spinner mt-5">
              <Spinner color="#002A59" />
            </Row>
          ) : (
            <>
              <Container className="grid justify-content-center align-items-center">
                <Row>
                  {this.state.esProfesor && (
                    <Col md="4">
                      <Link to="/crearJuego" style={{ textDecoration: "none" }}>
                        <CardAgregar seccion="Crear Juego" />
                      </Link>
                    </Col>
                  )}
                  {displayCards.map(
                    ({
                      imagen,
                      nombre,
                      nombre_grupo,
                      estado,
                      id_trivia,
                      fecha_cierre,
                      _id,
                    }) => (
                      <Col md="4" key={id_trivia}>
                        <Link
                          to={"/VerJuego/" + _id}
                          style={{ textDecoration: "none" }}
                        >
                          <CardJuego
                            imageSource={imagen}
                            juego={nombre}
                            grupo={nombre_grupo}
                            estado={estado}
                            fecha={fecha_cierre}
                          />
                        </Link>
                      </Col>
                    )
                  )}
                </Row>
              </Container>
            </>
          )}
        </Container>
      </>
    );
  }
}

export default Juego;
