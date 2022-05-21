import React, { Component } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import "./CrearJuego.css";

import ImageLoader from "../../../Componentes/imageLoader/imageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

import {
  Container,
  Col,
  Row,
  Form,
  Button,
  FormGroup,
  Input,
} from "reactstrap";

var nombreTrivia = "";
var idGrupo = "";
var nombreGrupo = "";

var imagenGlobal =
  "https://cdn.pixabay.com/photo/2014/05/02/21/47/laptop-336369_1280.jpg";
class CrearJuego extends Component {
  constructor(props) {
    super(props);
    this.obtenerCantidadPreguntas = this.obtenerCantidadPreguntas.bind(this);
    this.subirImagen = this.subirImagen.bind(this);
    this.obtenerNombreGrupo = this.obtenerNombreGrupo.bind(this);
    this.obtenerIdGrupo = this.obtenerIdGrupo.bind(this);
    this.state = {
      usuarioAutorizado: true,
      estado: true,
      indiceTiempoPregunta: 0,
      indiceCantidadPregunta: 0,
      maximoCantidadPregunta: 0,
      nombre: "",
      triviaDB: [],
      gruposDB: [],
      imagen: "",
    };
  }

  componentDidMount() {
    this.cargarGrupos();
    this.cargarTrivias();
  }

  cargarGrupos() {
    var self = this;
    var grupos = [];
    axios.post("/extraerGrupos").then(function (res) {
      if (res.data !== []) {
        res.data.forEach(function (grupo) {
          if (grupo.estado === true) {
            grupos.push(grupo);
          }
        });
        self.setState({
          gruposDB: grupos,
        });
      }
    });
  }

  cargarTrivias() {
    var self = this;
    axios.post("/extraerTrivias").then(function (res) {
      if (res.data !== []) {
        self.setState({
          triviaDB: res.data,
        });
      }
    });
  }

  obtenerCantidadPreguntas(event) {
    var self = this;
    nombreTrivia = event.target.value;
    axios
      .post("/extraerPreguntas/" + nombreTrivia, {
        idTrivia: nombreTrivia,
      })
      .then(function (res) {
        if (res.data !== []) {
          self.setState({ maximoCantidadPregunta: res.data.length });
        }
      });
  }

  obtenerNombreGrupo(id) {
    var grupos = this.state.gruposDB;
    grupos.forEach(function (grupo) {
      if (grupo._id === id) {
        nombreGrupo = grupo.nombre;
      }
    });
  }

  obtenerIdGrupo(event) {
    idGrupo = event.target.value;
    this.obtenerNombreGrupo(idGrupo);
  }

  esVacio(valor) {
    var estado = valor === "" ? true : false;
    return estado;
  }

  verificarCampos() {
    if (
      !this.esVacio(nombreTrivia) &&
      !this.esVacio(idGrupo) &&
      !this.esVacio(this.fechaApertura.value) &&
      !this.esVacio(this.horaApertura.value) &&
      !this.esVacio(this.fechaCierre.value) &&
      !this.esVacio(this.horaCierre.value) &&
      !this.esVacio(this.nombreJuego.value) &&
      this.state.indiceCantidadPregunta !== 0 &&
      this.state.indiceTiempoPregunta !== 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  enviarFormulario(urlImagen) {
    var data = this.state;
    var id_trivia = nombreTrivia;
    var id_grupo = idGrupo;
    var nombre_grupo = nombreGrupo;
    var nombre = this.nombreJuego.value;
    var fecha_apertura =
      this.fechaApertura.value + "T06:" + this.horaApertura.value;
    var fecha_cierre = this.fechaCierre.value + "T06:" + this.horaCierre.value;
    var preguntas_por_partida = data.indiceCantidadPregunta;
    var tiempo_por_pregunta = data.indiceTiempoPregunta;
    var estado = data.estado;
    var imagen = urlImagen;

    let obj = {
      id_trivia,
      id_grupo,
      nombre_grupo,
      nombre,
      fecha_apertura,
      fecha_cierre,
      preguntas_por_partida,
      tiempo_por_pregunta,
      estado,
      imagen,
    };

    var post = axios.post("/crearJuegos", obj);

    post.then(function (res) {
      if (!res.data.success) alert(res.data.error);
      else alert(res.data.message);
    });
  }

  onChange = (e) =>
    this.setState({
      [e.target.name]: e.target.value,
    });

  cambioTiempoPregunta = (e) => {
    this.setState({ indiceTiempoPregunta: e.currentTarget.value });
  };

  cambioCantidadPregunta = (e) => {
    this.setState({ indiceCantidadPregunta: e.currentTarget.value });
  };

  setImgPath(path) {
    this.state.imagen = path;
  }

  subirImagen = (e) => {
    if (this.verificarCampos()) {
      if (this.state.imagen !== "" && this.state.imagen !== null) {
        const formData = new FormData();
        formData.append("file", this.state.imagen);
        formData.append("upload_preset", "p8vfboo9");

        axios
          .post("https://api.cloudinary.com/v1_1/tecrow/image/upload", formData)
          .then((response) => {
            imagenGlobal = response.data.url;
            this.enviarFormulario(imagenGlobal);
          });
      } else {
        this.enviarFormulario(imagenGlobal);
      }
    } else {
      alert("Deben llenarse todos los campos");
    }
  };

  render() {
    return (
      <div>
        <Container className="my-5">
          <Row>
            <Container style={{ display: "inline-flex" }}>
              <Link className="link" to="/Juego" style={{ marginRight: "1em" }}>
                <FontAwesomeIcon
                  className="homeLink"
                  icon={faArrowCircleLeft}
                  size="2x"
                />
              </Link>
              <Col xs="6" className="text-start">
                <h3 className="titulo">Crear Juego</h3>
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

          <Row className="justify-content-center">
            <Form>
              <FormGroup>
                <Row className="justify-content-center">
                  <Col xs="6">
                    <ImageLoader
                      imagen={this.state.imagen}
                      setImgPath={(path) => this.setImgPath(path)}
                    />
                  </Col>
                </Row>
                <br />
                <Row>
                  <h2>Trivia</h2>
                  <Input
                    innerRef={(node) => (this.triviasList = node)}
                    type="select"
                    size="lg"
                    onChange={this.obtenerCantidadPreguntas}
                  >
                    <option>--Seleccione Trivia--</option>
                    {this.state.triviaDB.map((trivia) => (
                      <option value={trivia._id}>{trivia.nombre}</option>
                    ))}
                  </Input>
                </Row>
                <br />
                <Row>
                  <h2>Grupo</h2>
                  <Input
                    innerRef={(node) => (this.gruposList = node)}
                    type="select"
                    size="lg"
                    onChange={this.obtenerIdGrupo}
                  >
                    <option>--Seleccione Grupo--</option>
                    {this.state.gruposDB.map((grupo) => (
                      <option value={grupo._id}>{grupo.nombre}</option>
                    ))}
                  </Input>
                </Row>
                <br />
                <Row>
                  <h2>Nombre de Juego</h2>
                  <Input
                    innerRef={(node) => (this.nombreJuego = node)}
                    size="lg"
                    placeholder="Nombre del Juego"
                  />
                </Row>
              </FormGroup>
              <br />
              <FormGroup>
                <Row>
                  <Col>
                    <h2>Apertura</h2>
                  </Col>
                  <Col>
                    <Input
                      innerRef={(node) => (this.fechaApertura = node)}
                      type="date"
                      id="fechaApertura"
                      size="lg"
                    />
                  </Col>
                  <Col>
                    <Input
                      innerRef={(node) => (this.horaApertura = node)}
                      type="time"
                      id="horaApertura"
                      size="lg"
                    />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col>
                    <h2>Cierre</h2>
                  </Col>
                  <Col>
                    <Input
                      innerRef={(node) => (this.fechaCierre = node)}
                      type="date"
                      id="fechaCierre"
                      size="lg"
                    />
                  </Col>
                  <Col>
                    <Input
                      innerRef={(node) => (this.horaCierre = node)}
                      type="time"
                      id="horaCierre"
                      size="lg"
                    />
                  </Col>
                </Row>
              </FormGroup>
              <br />
              <FormGroup>
                <Row>
                  <Col xs={4}>
                    <h2>Preguntas por Juego</h2>
                  </Col>
                  <Col>
                    <Input
                      onInput={this.cambioCantidadPregunta}
                      size="lg"
                      type="range"
                      min="1"
                      max={this.state.maximoCantidadPregunta}
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
                    <h2>Tiempo por Pregunta</h2>
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
              <Col sm="12" md={{ size: 6, offset: 5 }}>
                <Button
                  className="boton"
                  outline
                  color="primary"
                  size="lg"
                  onClick={this.subirImagen}
                >
                  Registrar
                </Button>
              </Col>
            </Form>
          </Row>
        </Container>
      </div>
    );
  }
}

export default CrearJuego;
