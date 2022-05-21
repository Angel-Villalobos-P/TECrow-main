import React, { Component, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Timer from "react-compound-timer";

//Estilos
import "./Estudiante.css";

//ReactStrap
import {
  Button,
  Container,
  Col,
  Row,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Spinner,
} from "reactstrap";

class Partida extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexPregunta: -1,
      initialTime: 0,
      loading: false,
      puntuacion: 0,
      terminar: false,
      code: "",
      cant_preguntas: 0,
      respuestas: [],
      id_trivia: "",
      id_usuario: "",
      id_juego: "",
      enunciado: "",
      audiovisual: "",
      preguntas: [],
      resto: [],
      opciones: [],
      disableB: false,
    };
  }

  componentDidMount() {
    this.setState({
      initialTime: this.props.location.state.initialTime * 1000,
      id_trivia: this.props.location.state.id_trivia,
      id_usuario: this.props.location.state.id_usuario,
      id_juego: this.props.location.state.id_juego,
      cant_preguntas: this.props.location.state.cant_preguntas,
      respuestas: this.props.location.state.respuestas,
    });

    this.extraerRespuestas();
  }

  registrarRespuesta = (event, tiempo) => {
    //alert(event.target.innerText);
    var seconds = ((tiempo % 60000) / 1000).toFixed(0);
    this.state.opciones.forEach((element) => {
      if (element.respuesta === event.target.innerText) {
        let indiceAux = this.state.indexPregunta;
        if (element.esCorrecta) {
          alert("Correcto");
          this.state.preguntas.forEach((element, i) => {
            if (indiceAux === i) {
              element.aciertos += 1;
            }
          });
          this.state.puntuacion += 20 * seconds;
        } else {
          alert("Incorrecto");
          this.state.preguntas.forEach((element, i) => {
            if (indiceAux === i) {
              element.fallos += 1;
            }
          });
        }
      }
    });
    this.state.disableB = true;
  };

  timerChange(tiempo) {
    if (tiempo <= 0) {
      this.state.disableB = true;
    }
  }

  cargarPregunta = async () => {
    let self = this;
    let data = this.state.preguntas;
    this.state.indexPregunta += 1;
    let index = this.state.indexPregunta;

    this.state.disableB = false;

    for (var indexa = 0; indexa < data.length; indexa++) {
      if (indexa === index) {
        this.state.enunciado = data[index].enunciado;
        this.state.audiovisual = data[index].audiovisual;

        this.state.opciones = data[index].opciones.filter(
          (elemento) => elemento.respuesta !== ""
        );

        this.state.opciones.sort(() => 0.5 - Math.random());
      }
    }

    if (index + 1 === data.length) {
      this.state.terminar = true;
    }

    self.setState({ loading: true });
  };

  extraerRespuestas = async () => {
    try {
      this.state.preguntas = this.props.location.state.respuestas.preguntas;
      //console.log(this.props.location.state);
      this.filtrar();
      this.setState({ loading: true });
    } catch (error) {
      console.log(error);
    }
    /* try {
      const data = await axios
        .post("/extraerRespuestas_Juego", {
          id_trivia: this.props.location.state.id_trivia,
          id_usuario: this.props.location.state.id_usuario,
          id_juego: this.props.location.state.id_juego,
        })
        .then((res) => {
          this.setState({ respuestas: res.data });
          this.setState({ preguntas: res.data.preguntas });
          this.filtrar();
          //console.log(res.data);
        });
      this.setState({ loading: true });
    } catch (e) {
      console.log(e);
    } */
  };

  filtrar() {
    this.state.preguntas.sort((a, b) =>
      a.fallos + a.aciertos > b.fallos + b.aciertos
        ? 1
        : b.fallos + b.aciertos > a.fallos + a.aciertos
        ? -1
        : 0
    );

    let resto = [];
    let preguntas = [];
    this.state.preguntas.forEach((element, i) => {
      if (i < this.props.location.state.cant_preguntas) {
        preguntas.push(element);
      } else {
        resto.push(element);
      }
    });

    this.state.preguntas = preguntas;
    this.state.resto = resto;
    this.cargarPregunta();
  }

  generarDatos = async () => {
    var data = this.state;
    var id_usuario = data.id_usuario;
    var id_juego = data.id_juego;
    var id_trivia = data.id_trivia;
    var preguntas = data.preguntas;
    data.resto.forEach((element) => {
      preguntas.push(element);
    });
    var nuevoIntento = {
      num_partida: data.respuestas.cantidad_intentos.length + 1,
      puntaje: data.puntuacion,
    };

    for (let element of data.respuestas.cantidad_intentos) {
      if (element.num_partida === 0) {
        element.num_partida += 1;
        element.puntaje = data.puntuacion;
        break;
      } else {
        data.respuestas.cantidad_intentos.push(nuevoIntento);
        break;
      }
    }

    var cantidad_intentos = data.respuestas.cantidad_intentos;

    let obj = {
      id_usuario,
      id_juego,
      id_trivia,
      preguntas,
      cantidad_intentos,
    };

    console.log(obj);

    try {
      const data = await axios
        .patch("/actualizarRespuestas", {
          id_trivia: this.props.location.state.id_trivia,
          id_usuario: this.props.location.state.id_usuario,
          id_juego: this.props.location.state.id_juego,
          respuestas_juego: obj,
        })
        .then(function (res) {
          //if (!res.data.success) alert(res.data.error);
          //else alert(res.data.message);
        });
      this.setState({ loading: true });
    } catch (e) {
      console.log(e);
    }
    alert("Juego Terminado");
    alert("Juego Terminado\n Puntuacion final: " + this.state.puntuacion);
  };

  cargarImagen = async () => {
    if (this.state.audiovisual !== "")
      return (
        <img width="100%" src={this.state.audiovisual} alt="Card image cap" />
      );
    else {
      return <CardText>Prueba</CardText>;
    }
  };

  render() {
    let cant = this.state.preguntas.length;

    return (
      <>
        <Container className="my-5">
          <Row>
            <Col xs="6" className="text-start">
              <h3>Juego</h3>
            </Col>
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
              <Timer initialTime={this.state.initialTime} direction="backward">
                {({ start, stop, reset, getTime }) => (
                  <React.Fragment>
                    <Row className="mb-5">
                      <Col sm="6">
                        <h4>
                          Pregunta {this.state.indexPregunta + 1}/{cant}
                        </h4>
                      </Col>

                      <Col sm="6" className="text-end">
                        <h4>
                          <Timer.Seconds />
                          {this.timerChange(getTime())} segundos restantes
                        </h4>
                      </Col>
                    </Row>

                    <Card body className="text-center">
                      {this.state.audiovisual !== "" ? (
                        <>
                          <CardTitle tag="h5">{this.state.enunciado}</CardTitle>
                          <img
                            style={{
                              height: "300px",
                              maxHeight: "300px",
                              width: "auto",
                              objectFit: "fill",
                            }}
                            width="100%"
                            src={this.state.audiovisual}
                            alt="Card image cap"
                          />
                        </>
                      ) : (
                        <CardTitle tag="h2">{this.state.enunciado}</CardTitle>
                      )}
                      <CardBody>
                        <Row xs="2">
                          {this.state.opciones.map(({ respuesta, _id }) => (
                            <Col className="mt-3" key={_id}>
                              {respuesta !== "" ? (
                                <Button
                                  disabled={this.state.disableB}
                                  size="lg"
                                  style={{
                                    width: "75%",
                                    height: "100%",
                                    flexShrink: 1,
                                    background: "#002A59",
                                  }}
                                  onClick={(event) => {
                                    stop();
                                    this.registrarRespuesta(event, getTime());
                                  }}
                                >
                                  {respuesta}
                                </Button>
                              ) : (
                                <></>
                              )}
                            </Col>
                          ))}
                        </Row>
                      </CardBody>
                    </Card>

                    <Row className="text-center">
                      <Col className="mt-3">
                        {this.state.terminar ? (
                          <Link
                            to={{
                              pathname: "/ReporteEstudiante",
                              state: {
                                id_trivia: this.props.location.state.id_trivia,
                                id_juego: this.props.location.state.id_juego,
                              },
                            }}
                          >
                            <Button
                              id="btnSiguiente"
                              onClick={() => {
                                this.generarDatos();
                              }}
                            >
                              Terminar
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            id="btnSiguiente"
                            onClick={() => {
                              this.cargarPregunta();
                              start();
                              reset();
                            }}
                          >
                            Siguiente
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </React.Fragment>
                )}
              </Timer>
            </>
          )}
        </Container>
      </>
    );
  }
}

export default Partida;
