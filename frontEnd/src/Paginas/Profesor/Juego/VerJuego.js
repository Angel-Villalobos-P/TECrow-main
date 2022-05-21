import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Button,
  Form,
  FormGroup,
  Input,
  Container,
  Col,
  Row,
  Card,
  CardImg,
  Label,
  Spinner,
} from "reactstrap";

import DefaultImage from "../Trivia/TriviaDefaultImage.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faTrash } from "@fortawesome/free-solid-svg-icons";

var nombreTrivia = "";
var nombreGrupo = "";
var realizoCambio = false;
var idGlobal = "";
var nombreMostradoTrivia = "";
var nombreMostradoGrupo = "";

var copia_juego = [];

class VerJuego extends Component {
  constructor(props) {
    super(props);
    this.obtenerCantidadPreguntas = this.obtenerCantidadPreguntas.bind(this);
    this.obtenerCantidadPreguntasTrivia =
      this.obtenerCantidadPreguntasTrivia.bind(this);
    this.enviarFormulario = this.enviarFormulario.bind(this);
    this.state = {
      usuarioAutorizado: true,
      estado: true,
      indiceTiempoPregunta: 0,
      indiceCantidadPregunta: 0,
      maximoCantidadPregunta: 0,
      fecha_apertura: "",
      fecha_cierre: "",
      nombre: "",
      triviaDB: [],
      gruposDB: [],
      juego: [],
      imagen: "",
      loading: false,
    };

    // alert(this.state.indiceCantidadPregunta);
  }

  componentDidMount() {
    this.cargarGrupos();
  }

  async cargarGrupos() {
    var self = this;
    var grupos = [];
    await axios.post("/extraerGrupos").then(function (res) {
      if (true) {
        res.data.forEach(function (grupo) {
          if (grupo.estado === true) {
            grupos.push(grupo);
          }
        });
        self.setState({
          gruposDB: grupos,
        });
      }
      self.cargarTrivias();
    });
  }

  async cargarTrivias() {
    var self = this;
    await axios.post("/extraerTrivias").then(function (res) {
      if (res.data !== []) {
        self.setState({
          triviaDB: res.data,
        });
      }
      self.cargarJuego();
    });
  }

  async cargarJuego() {
    var self = this;
    idGlobal = this.props.match.params.id;
    await axios.get("/extraerJuego/" + idGlobal).then((res) => {
      self.setState({
        juego: res.data,
        indiceCantidadPregunta: res.data.preguntas_por_partida,
        indiceTiempoPregunta: res.data.tiempo_por_pregunta,
        imagen: res.data.imagen,
      });
      this.obtenerCantidadPreguntasTrivia(this.state.juego.id_trivia);
      this.guardarJuego(res.data);
      self.setState({ loading: true });
    });
  }

  guardarJuego(datos) {
    var data = this.state;
    data.juego = datos;
    this.setState(data);
    copia_juego = datos;
    this.fijarFechas();
    this.obtenerNombre_Trivia();
    this.obtenerNombre_Grupo();
  }

  async obtenerCantidadPreguntasTrivia(nombre) {
    nombreTrivia = nombre;
    var self = this;
    await axios
      .post("/extraerPreguntas/" + nombreTrivia, {
        idTrivia: nombreTrivia,
      })
      .then(function (res) {
        if (res.data !== []) {
          self.setState({ maximoCantidadPregunta: res.data.length });
        }
      });
  }

  fijarFechas() {
    this.setState({
      fecha_apertura: copia_juego.fecha_apertura,
      fecha_cierre: copia_juego.fecha_cierre,
    });
  }

  obtenerCantidadPreguntas(event) {
    realizoCambio = true;
    nombreTrivia = event.target.value;
    this.obtenerCantidadPreguntasTrivia(nombreTrivia);
  }

  obtenerNombreGrupo(event) {
    realizoCambio = true;
    nombreGrupo = event.target.value;
  }

  eliminarJuego() {
    axios
      .delete("/eliminarJuego/" + idGlobal)
      .then(() => window.location.reload(false));
  }

  enviarFormulario() {
    if (realizoCambio) {
      var id = idGlobal;
      var data = this.state;
      var id_trivia = nombreTrivia;
      var id_grupo = nombreGrupo;
      var nombre = this.nombreJuego.value;
      var fecha_apertura =
        this.fechaApertura.value + "T06:" + this.horaApertura.value;
      var fecha_cierre =
        this.fechaCierre.value + "T06:" + this.horaCierre.value;
      var preguntas_por_partida = data.indiceCantidadPregunta;
      var tiempo_por_pregunta = data.indiceTiempoPregunta;
      var estado = data.estado;
      var imagen = this.state.imagen;

      let obj = {
        id,
        id_trivia,
        id_grupo,
        nombre,
        fecha_apertura,
        fecha_cierre,
        preguntas_por_partida,
        tiempo_por_pregunta,
        estado,
        imagen,
      };

      axios
        .patch("/actualizarJuego/" + id, {
          juego: obj,
        })
        .then(function (res) {
          if (!res.data.success) alert(res.data.error);
          else alert(res.data.message);
        });
    } else {
      alert("Sin Cambios registrados");
    }
  }

  obtenerNombre_Trivia() {
    var trivias = this.state.triviaDB;
    trivias.forEach(function (data) {
      if (data._id === copia_juego.id_trivia) {
        nombreTrivia = data._id;
        nombreMostradoTrivia = data.nombre;
      }
    });
  }

  obtenerNombre_Grupo() {
    var grupos = this.state.gruposDB;
    grupos.forEach(function (data) {
      if (data._id === copia_juego.id_grupo) {
        nombreMostradoGrupo = data.nombre;
        nombreGrupo = data._id;
      }
    });
  }

  onChange = (e) =>
    this.setState({
      [e.target.name]: e.target.value,
    });

  huboCambio() {
    realizoCambio = true;
  }

  cambioTiempoPregunta = (e) => {
    realizoCambio = true;
    this.setState({ indiceTiempoPregunta: e.currentTarget.value });
  };

  cambioCantidadPregunta = (e) => {
    realizoCambio = true;
    this.setState({ indiceCantidadPregunta: e.currentTarget.value });
  };

  render() {
    var maximoCantidad = this.state.maximoCantidadPregunta;
    var fechaCompletaApertura = this.state.fecha_apertura;
    var fechaAperturaFijada = fechaCompletaApertura.toString().substr(0, 10);
    var horaAperturaFijada = fechaCompletaApertura.toString().substr(14, 5);
    var fechaCompletaCierre = this.state.fecha_cierre;
    var fechaCierreFijada = fechaCompletaCierre.toString().substr(0, 10);
    var horaCierreFijada = fechaCompletaCierre.toString().substr(14, 5);

    return (
      <div>
        <Container className="my-5">
          <Row>
            <Container style={{ display: "inline-flex" }}>
              <Link
                to="/Juego"
                style={{ marginRight: "1em", marginTop: "0.6em" }}
              >
                <FontAwesomeIcon
                  style={{ color: "#ffc953" }}
                  icon={faArrowCircleLeft}
                  size="2x"
                />
              </Link>
              <Col
                xs="11"
                className="text-start"
                style={{ marginTop: "0.7em" }}
              >
                <h3>Detalle Juego</h3>
              </Col>
              <Col>
                <Link to="/Juego">
                  <Button outline color="danger" style={{ margin: 0 }}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      size="2x"
                      onClick={this.eliminarJuego}
                    />
                  </Button>
                </Link>
              </Col>
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
              <Form>
                <FormGroup>
                  <Row className="justify-content-center">
                    <Col xs="6">
                      <Card>
                        <CardImg
                          top
                          width="100%"
                          className="imagenTrivia"
                          src={
                            this.state.imagen === ""
                              ? DefaultImage
                              : this.state.imagen
                          }
                          alt="Card image cap"
                        />
                      </Card>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Label className="titulo">Trivia</Label>
                    <Input
                      innerRef={(node) => (this.triviasList = node)}
                      type="select"
                      size="lg"
                      onChange={this.obtenerCantidadPreguntas}
                    >
                      <option>{nombreMostradoTrivia}</option>
                      {this.state.triviaDB.map((trivia) => (
                        <option value={trivia._id}>{trivia.nombre}</option>
                      ))}
                    </Input>
                  </Row>
                  <br />
                  <Row>
                    <Label className="titulo">Grupo</Label>
                    <Input
                      innerRef={(node) => (this.gruposList = node)}
                      type="select"
                      size="lg"
                      onChange={this.obtenerNombreGrupo}
                    >
                      <option>{nombreMostradoGrupo}</option>
                      {this.state.gruposDB.map((grupo) => (
                        <option value={grupo._id}>{grupo.nombre}</option>
                      ))}
                    </Input>
                  </Row>
                  <br />
                  <Row>
                    <Label className="titulo">Nombre de Juego</Label>
                    <Input
                      innerRef={(node) => (this.nombreJuego = node)}
                      size="lg"
                      defaultValue={this.state.juego.nombre}
                      onChange={this.huboCambio}
                    />
                  </Row>
                </FormGroup>
                <br />
                <FormGroup>
                  <Row>
                    <Col>
                      <Label className="titulo">Apertura</Label>
                    </Col>
                    <Col>
                      <Input
                        innerRef={(node) => (this.fechaApertura = node)}
                        type="date"
                        id="fechaApertura"
                        size="lg"
                        defaultValue={fechaAperturaFijada}
                        onInput={this.huboCambio}
                      />
                    </Col>
                    <Col>
                      <Input
                        innerRef={(node) => (this.horaApertura = node)}
                        type="time"
                        id="horaApertura"
                        size="lg"
                        defaultValue={horaAperturaFijada}
                        onInput={this.huboCambio}
                      />
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col>
                      <Label className="titulo">Cierre</Label>
                    </Col>
                    <Col>
                      <Input
                        innerRef={(node) => (this.fechaCierre = node)}
                        type="date"
                        id="fechaCierre"
                        size="lg"
                        defaultValue={fechaCierreFijada}
                        onInput={this.huboCambio}
                      />
                    </Col>
                    <Col>
                      <Input
                        innerRef={(node) => (this.horaCierre = node)}
                        type="time"
                        id="horaCierre"
                        size="lg"
                        defaultValue={horaCierreFijada}
                        onInput={this.huboCambio}
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <br />
                <FormGroup>
                  <Row>
                    <Col xs={4}>
                      <Label className="titulo">Preguntas por Juego</Label>
                    </Col>
                    <Col>
                      <Input
                        onInput={this.cambioCantidadPregunta}
                        size="lg"
                        type="range"
                        min="1"
                        max={maximoCantidad}
                        step="1"
                        value={this.state.indiceCantidadPregunta}
                        className="input"
                      />
                    </Col>
                    <Col>
                      <h2>{this.state.indiceCantidadPregunta}</h2>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col xs={4}>
                      <Label className="titulo">Tiempo por Pregunta</Label>
                    </Col>
                    <Col>
                      <Input
                        onInput={this.cambioTiempoPregunta}
                        size="lg"
                        type="range"
                        min="30"
                        max="60"
                        step="1"
                        value={this.state.indiceTiempoPregunta}
                        className="input"
                      />
                    </Col>
                    <Col>
                      <h2>{this.state.indiceTiempoPregunta}</h2>
                    </Col>
                  </Row>
                </FormGroup>
                <br />
                <br />
                <br />
                <Container className="btn">
                  <Button
                    className="boton"
                    outline
                    color="primary"
                    size="lg"
                    onClick={this.enviarFormulario}
                  >
                    Guardar Cambios
                  </Button>
                  <Link
                    to={{
                      pathname: "/ReporteProfesor",
                      state: {
                        idJuego: idGlobal,
                        idTrivia: nombreMostradoTrivia,
                      },
                    }}
                  >
                    <Button className="boton" outline color="primary" size="lg">
                      Ver reporte
                    </Button>
                  </Link>
                </Container>
              </Form>
            </>
          )}
        </Container>
      </div>
    );
  }
}

export default VerJuego;
