import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Anychart from "anychart-react";

import "./ReporteEstudiante.css";
//icon imports
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
//fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Container, Col, Row, Spinner, Table } from "reactstrap";

// Vars o Const
var respuestas = [];
var partidas = [];

var noExistenDatos = false;

var graficoPregunta = {
  width: 400,
  height: 350,
  type: "column",
  data: [],
  title: "Aciertos por pregunta",
};

var graficoPartida = {
  width: 400,
  height: 350,
  type: "column",
  data: [],
  title: "Aciertos por partida",
};

class ReporteEstudiante extends Component {
  constructor(props) {
    super(props);
    this.cargarRespuestas = this.cargarRespuestas.bind(this);
    this.crearDatosPreguntas = this.crearDatosPreguntas.bind(this);
    this.state = {
      idGlobal: "",
      idTrivia: "",
      respuestasRendimiento: [],
      respuestas: [],
      respuestasEstudianteDB: [],
      loading: false,
    };
  }

  componentDidMount() {
    /* this.setState({
      idGlobal: this.props.location.state.idGlobal,
      idTrivia: this.props.location.state.idTrivia,
    }); */
    this.cargarRespuestas();
  }

  async cargarRespuestas() {
    var self = this;
    console.log(this.props.location.state.id_juego);
    console.log(this.props.location.state.id_trivia);

    var idGlobal = this.props.location.state.id_juego;
    // var idGlobal = "juego";
    var idTrivia = this.props.location.state.id_trivia;
    // var idTrivia = "Trivia";

    await axios
      .post("/extraerRespuestaEstudiante/" + idGlobal, { idTrivia: idTrivia })
      .then(function (res) {
        if (res.data.length !== 0) {
          console.log(res.data);
          self.setState({
            respuestasEstudianteDB: res.data[0],
          });
        } else {
          noExistenDatos = true;
        }
      });
    await axios
      .post("/extraerRespuestas/" + idGlobal, { idTrivia: idTrivia })
      .then(function (res) {
        if (res.data.length !== 0) {
          self.setState({
            respuestas: res.data[0],
          });
        } else {
          noExistenDatos = true;
        }
      });
    await axios
      .post("/extraerRendimientoPorEstudiante/" + idGlobal, {
        idTrivia: idTrivia,
      })
      .then(function (res) {
        if (res.data.length !== 0) {
          self.setState({
            respuestasRendimiento: res.data.datos,
          });
        } else {
          noExistenDatos = true;
        }
      });
    if (!noExistenDatos) {
      this.crearDatosPreguntas();
    }
  }

  crearDatosPartidas() {
    var self = this;
    partidas = this.state.respuestasEstudianteDB.cantidad_intentos;
    partidas.forEach((partida) => {
      var dato = [partida.num_partida, partida.puntaje];
      graficoPartida.data.push(dato);
    });
    self.setState({ loading: true });
  }

  crearDatosPreguntas() {
    respuestas = this.state.respuestasEstudianteDB.preguntas;
    respuestas.forEach((pregunta) => {
      if (pregunta.aciertos !== 0 && pregunta !== 0) {
        var dato = [pregunta.enunciado, pregunta.aciertos];
        graficoPregunta.data.push(dato);
      }
    });
    this.crearDatosPartidas();
  }

  render() {
    var i = 1;
    return (
      <div>
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
              <Col xs="11" className="title">
                <h2>Juego</h2>
              </Col>
            </Container>
          </Row>

          <br />
          {noExistenDatos ? (
            <h2>No existen datos todavía</h2>
          ) : !this.state.loading ? (
            <Row className="spinner mt-5">
              <Spinner color="#002A59" />
            </Row>
          ) : (
            <>
              <Row className="justify-content-center">
                <Container style={{ display: "inline-flex" }}>
                  <Col xs="11" className="title" style={{ marginTop: "0.7em" }}>
                    <h3>Reporte Estudiante</h3>
                    <hr
                      style={{
                        color: "#000000",
                        backgroundColor: "#000000",
                        height: 0.5,
                        borderColor: "#000000",
                        border: 3,
                      }}
                    />
                    <Row>
                      <Col>
                        <Anychart id="p1" {...graficoPartida} />
                      </Col>
                      <Col>
                        <Anychart id="p2" {...graficoPregunta} />
                      </Col>
                    </Row>
                  </Col>
                </Container>
              </Row>

              <br />

              <Row className="justify-content-center">
                <Container style={{ display: "inline-flex" }}>
                  <Col xs="11" className="title" style={{ marginTop: "0.7em" }}>
                    <h3>Ranking</h3>
                    <hr
                      style={{
                        color: "#000000",
                        backgroundColor: "#000000",
                        height: 0.7,
                        borderColor: "#000000",
                        border: 3,
                      }}
                    />
                    <Table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Jugador</th>
                          <th>Puntaje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.respuestasRendimiento
                          .sort((a, b) => b[1] - a[1])
                          .map((respuesta) => (
                            <tr>
                              <th scope="row">{i++}</th>
                              <td>{respuesta[0]}</td>
                              <td>{respuesta[1]}</td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </Col>
                </Container>
              </Row>
            </>
          )}
        </Container>
      </div>
    );
  }
}
export default ReporteEstudiante;
