import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Anychart from "anychart-react";

import "./ReporteProfesor.css";
//icon imports
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
//fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Container, Col, Row, Button, Spinner, Table } from "reactstrap";

// Vars o Const
var respuestas = [];
var preguntas = [];
var partidas = [];
var idGlobal = "";
var idTrivia = "";

var graficoPregunta = {
  width: 400,
  height: 350,
  type: "column",
  data: [],
  title: "Puntaje por estudiantes",
};

var graficoPartida = {
  width: 400,
  height: 350,
  type: "column",
  data: [],
  title: "Cantidad de aciertos por pregunta",
};

class ReporteProfesor extends Component {
  constructor(props) {
    super(props);
    this.cargarRespuestas = this.cargarRespuestas.bind(this);
    this.crearDatosPreguntas = this.crearDatosPreguntas.bind(this);

    this.state = {
      idJuego: props.location.state.idJuego,
      respuestas: [],
      respuestasEstudianteDB: [],
      loading: false,
      noExistenDatos: false,
    };
  }

  componentDidMount() {
    this.cargarRespuestas();
  }

  async cargarRespuestas() {
    var self = this;
    await axios
      .get("/extraerRespuestaProfesor/" + this.state.idJuego)
      .then(function (res) {
        self.setState({
          respuestasEstudianteDB: res.data.datos,
          noExistenDatos: res.data.vacio,
        });
      });
    if (!this.state.noExistenDatos) {
      await axios
        .post("/extraerRendimientoPorEstudiante/" + this.state.idJuego)
        .then(function (res) {
          self.setState({
            respuestas: res.data.datos,
          });
        });
      graficoPartida.data = self.state.respuestasEstudianteDB;
      graficoPregunta.data = self.state.respuestas;
      this.setState({ loading: true });
    }
  }

  crearDatosPreguntas() {
    respuestas = this.state.respuestasEstudianteDB.preguntas;
    respuestas.forEach((pregunta) => {
      var dato = [pregunta.enunciados, pregunta.aciertos];
      graficoPregunta.data.push(dato);
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
                to={"/VerJuego/" + this.state.idJuego}
                style={{ marginRight: "1em" }}
              >
                <FontAwesomeIcon
                  className="homeLink"
                  icon={faArrowCircleLeft}
                  size="2x"
                />
              </Link>
              <Col xs="11" className="text-start">
                <h3>Reporte Profesor</h3>
              </Col>
            </Container>
          </Row>

          <br />

          {this.state.noExistenDatos ? (
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
                        {this.state.respuestas
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
export default ReporteProfesor;
