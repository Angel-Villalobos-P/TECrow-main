import React, { Component } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import "./CrearGrupo.css";

import ImageLoader from "../../../Componentes/imageLoader/imageLoader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faPlusCircle} from "@fortawesome/free-solid-svg-icons";

import { FormGroup, Input, Container, Col, Row, Form, Table, Button, Label} from "reactstrap";

var nombreEstudiante = "";
var nombreGrupo = "";
var imagenGlobal = "https://cdn.pixabay.com/photo/2014/05/02/21/47/laptop-336369_1280.jpg";
const minGrupo = 1;
const maxGrupo = 1000;

var fecha = new Date();

var fechaActual =
  fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate();

class CrearGrupo extends Component {
  constructor(props) {
    super(props);
    this.obtenerCodigoGrupo = this.obtenerCodigoGrupo.bind(this);
    this.revisarCodigoGrupo = this.revisarCodigoGrupo.bind(this);
    this.agregarFila = this.agregarFila.bind(this);
    this.obtenerEstudiante = this.obtenerEstudiante.bind(this);
    this.obtenerGrupo = this.obtenerGrupo.bind(this);
    this.fijarGrupo = this.fijarGrupo.bind(this);
    this.revisarNombreGrupo = this.revisarNombreGrupo.bind(this);
    this.limpiarEstado = this.limpiarEstado.bind(this);
    this.subirImagen = this.subirImagen.bind(this);
    this.cargarEstudiante = this.cargarEstudiante.bind(this);
    this.existeEstudiante = this.existeEstudiante.bind(this);
    this.state = {
      estudiantesDB: [],
      totalGrupos: [],
      gruposProfesor: [],
      usuarioAutorizado: true,
      codigo: "",
      estado: true,
      estudiantes: [],
      juegos: [],
      fechaCreacion: "",
      fechaUltimaModificacion: "",
      nombre: "",
      imagen:
        "",
    };
  }

  limpiarEstado() {
    var nuevoEstado = this.state;
    nuevoEstado.codigo = "";
    nuevoEstado.estudiantes = [];
    nuevoEstado.juegos = [];
    nuevoEstado.fechaCreacion = "";
    nuevoEstado.fechaUltimaModificacion = [];
    nuevoEstado.nombre = "";
  }

  revisarNombreGrupo() {
    var data = this.state.gruposProfesor;
    data.forEach(function (data) {
      if (data.nombre === nombreGrupo) {
        return true;
      }
    });
    return false;
  }

  revisarCodigoGrupo(codigo) {
    var data = this.state.totalGrupos;
    var presente = false;
    data.forEach(function (data) {
      if (data.codigo === codigo) {
        presente = true;
      }
    });
    console.log(presente);
    return presente;
  }

  obtenerCodigoGrupo() {
    var codigo =
      "G" + Math.floor(Math.random() * (maxGrupo - minGrupo)) + minGrupo;
    console.log(codigo);
    while (this.revisarCodigoGrupo(codigo)) {
      console.log(codigo);
      codigo =
        "G" + Math.floor(Math.random() * (maxGrupo - minGrupo)) + minGrupo;
    }
    return codigo;
  }

  fijarGrupo() {
    var siguienteEstado = this.state;
    if (!this.revisarNombreGrupo()) {
      siguienteEstado.nombre = nombreGrupo;
      siguienteEstado.fechaCreacion = fechaActual;
      siguienteEstado.fechaUltimaModificacion = fechaActual;
      siguienteEstado.codigo = this.obtenerCodigoGrupo();
      this.setState(siguienteEstado);
      this.subirImagen();
    } else {
      console.warn("Nombre ya existe");
    }
  }

  existeEstudiante(carnet) {
    var datosEstudiante = this.state.estudiantesDB;
    var presente = false;
    datosEstudiante.forEach(  function(estudiante) {
      if(estudiante.carnet === carnet){
        presente = true;
      }
    });
    console.log(presente);
    return presente;
  }

  agregarFila() {
    var siguienteEstado = this.state;
    if (nombreEstudiante !== "") {
      if (!siguienteEstado.estudiantes.includes(nombreEstudiante)) {
        if(this.existeEstudiante(nombreEstudiante)){
          siguienteEstado.estudiantes.push(nombreEstudiante);
          this.setState(siguienteEstado);
          nombreEstudiante = "";
        } else {
          alert("El carnet ingresado no existe");
        }
        
      } else {
        alert("Estudiante ya agregado");
      }
    }
  }

  obtenerEstudiante(event) {
    var name = event.target.value;
    nombreEstudiante = name;
  }

  obtenerGrupo(event) {
    var name = event.target.value;
    nombreGrupo = name;
  }

  componentDidMount() {
    this.cargarEstudiante();
    this.cargarGrupos();
  }

  cargarEstudiante(){
    var self = this;
    axios.post("/extraerEstudiantes").then(function (res){
      if(res.data !== []){
        self.setState({
          estudiantesDB: res.data,
        });
      }
    });
  }

  cargarGrupos() {
    var self = this;
    axios
      .post("/extraerGrupos", {
        pIdUsuario: this.state.idUsuario,
      })
      .then(function (res) {
        if (res.data !== []) {
          self.setState({
            gruposProfesor: res.data,
          });
        }
      });
    axios.post("/extraerTotalGrupos").then(function (res) {
      if (res.data !== []) {
        self.setState({
          totalGrupos: res.data,
        });
      }
    });
  }

  guardarGrupos(urlImagen) {
    var data = this.state;
    var idUsuario = data.idUsuario;
    var codigo = data.codigo;
    var estado = data.estado;
    var estudiantes = data.estudiantes;
    var juegos = data.juegos;
    var fechaCreacion = data.fechaCreacion;
    var fechaUltimaModificacion = data.fechaUltimaModificacion;
    var nombre = data.nombre;
    var imagen = urlImagen;

    let obj = {
      idUsuario,
      nombre,
      codigo,
      estado,
      fechaCreacion,
      fechaUltimaModificacion,
      estudiantes,
      juegos,
      imagen,
    };

    axios.post("/crearGrupos", obj).then(function (res) {
      if (!res.data.success) alert(res.data.error);
      else alert(res.data.message);
    });

    this.limpiarEstado();
  }

  setImgPath(path) {
    this.state.imagen = path;
  }

  subirImagen = (e) => {
    if (this.state.imagen !== "" && this.state.imagen !== null) {
      const formData = new FormData();
      formData.append("file", this.state.imagen);
      formData.append("upload_preset", "p8vfboo9");

      axios
        .post("https://api.cloudinary.com/v1_1/tecrow/image/upload", formData)
        .then((response) => {
          imagenGlobal = response.data.url;
          this.guardarGrupos(imagenGlobal);
        });
    } else {
      this.guardarGrupos(imagenGlobal);
    }
  };

  onChange = (e) =>
    this.setState({
      [e.target.name]: e.target.value,
    });

  render() {
    return (
      <div>
        <Container className="my-5">
          <Row>
            <Container style={{ display: "inline-flex" }}>
              <Link
                className="link"
                to="/Grupos"
                style={{ marginRight: "1em" }}
              >
                <FontAwesomeIcon
                  className="homeLink"
                  icon={faArrowCircleLeft}
                  size="2x"
                />
              </Link>
              <Col
                xs="11"
                className="text-start"
                style={{ marginTop: "0.7em" }}
              >
                <h3>Crear Grupo</h3>
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

          <Form>
            <Row className="justify-content-center">
              <Col xs="6">
                <ImageLoader
                  imagen={this.state.imagen}
                  setImgPath={(path) => this.setImgPath(path)}
                />
              </Col>
            </Row>
            <br />
            <br />
            <FormGroup row>
              <Label className="titulo">Nombre Grupo</Label>
              <Col xs={10}>
                <Input
                  type="text"
                  placeholder="Nombre"
                  id="nombreGrupo"
                  onChange={this.obtenerGrupo}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label className="titulo">Añadir Estudiante</Label>
              <Col xs={10}>
                <Input
                  type="text"
                  placeholder="Nombre"
                  id="nombreEstudiante"
                  onChange={this.obtenerEstudiante}
                />
              </Col>
              <Col xs={2}>
                <Button color="primary" size="lg" onClick={this.agregarFila}>
                  <FontAwesomeIcon icon={faPlusCircle} /> Agregar
                </Button>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Table className="table">
                <thead>
                  <tr>
                    <th scope="col">Miembro</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.estudiantes.map((estudiante) => (
                    <tr key={estudiante}>{estudiante}</tr>
                  ))}
                </tbody>
              </Table>
            </FormGroup>
            <Button color="primary" size="lg" onClick={this.fijarGrupo}>
              Registrar
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
}

export default CrearGrupo;
