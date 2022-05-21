import React, { Component } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import "./Trivias.css";
import DefaultImage from "./TriviaDefaultImage.png";

//icon imports
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
//fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import moment from "moment";
import "moment/locale/es";

import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Col,
  Row,
  Card,
  CardImg,
  ListGroupItem,
  ListGroup,
  Spinner,
} from "reactstrap";

class VerTrivia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idTrivia: this.props.match.params.id,
      id_profesor: "",
      nombre: "",
      descripcion: "",
      fecha_creacion: "",
      fecha_modificacion: "",
      imagen: "",
      material_apoyo: "",
      preguntas: [],
      sugerencias: [],
      loading: false,
    };

    this.guardarCambios = this.guardarCambios.bind(this);
    this.onInputchange = this.onInputchange.bind(this);
  }
  componentDidMount() {
    var self = this;
    try {
      const data = axios
        .get("/extraerTrivia/" + this.props.match.params.id)
        .then((res) => {
          self.setState({
            id_profesor: res.data.id_profesor,
            nombre: res.data.nombre,
            descripcion: res.data.descripcion,
            fecha_creacion: res.data.fecha_creacion,
            fecha_modificacion: res.data.fecha_modificacion,
            imagen: res.data.imagen,
            material_apoyo: res.data.material_apoyo,
          });
        });
      self.cargarPreguntas();
    } catch (e) {
      console.log(e);
    }
  }
  onInputchange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  cargarTrivia() {
    var self = this;
    axios
      .get("/extraerTrivia/" + this.props.match.params.id, {
        idTrivia: this.state.idTrivia,
      })
      .then(function (res) {
        if (res.data !== []) {
          self.setState({ trivia: res.data });
        }
      });
  }

  cargarPreguntas = async () => {
    var self = this;
    var self = this;
    try {
      const data = await axios
        .post("/extraerPreguntas/" + this.props.match.params.id, {
          idTrivia: this.state.idTrivia,
        })
        .then(function (res) {
          if (res.data !== []) {
            var preguntasMap = [];
            var sugerenciasMap = [];
            for (var i = 0; i < res.data.length; i++) {
              if (!res.data[i].esSugerencia) preguntasMap.push(res.data[i]);
              else sugerenciasMap.push(res.data[i])
            }
            self.setState({ preguntas: preguntasMap, sugerencias: sugerenciasMap, loading: true });
          }
        });

    } catch (e) {
      console.log(e);
    }
    self.setState({ loading: true });
  };

  guardarCambios() {
    var data = this.state;
    var nombre = data.nombre;
    var descripcion = data.descripcion;
    var fecha_modificacion = moment().format();
    var material_apoyo = data.material_apoyo;

    let obj = {
      nombre,
      descripcion,
      fecha_modificacion,
      material_apoyo,
    };

    axios
      .patch("/actualizarTrivia/" + this.props.match.params.id, {
        trivia: obj,
      })
      .then(function (res) {
        if (!res.data.success) console.log(res.data.error);
        else console.log(res.data.message);
      });
  }

  eliminarPregunta(idPregunta) {
    return () => {
      axios
        .delete("/eliminarPregunta/" + idPregunta)
        .then(() => window.location.reload(false));
    };
  }

  eliminarTrivia(idTrivia) {
    return () => {
      axios
        .delete("/eliminarPreguntas/" + idTrivia)
        .then(() => window.location.reload(true));

      axios
        .delete("/eliminarTrivia/" + idTrivia)
        .then(() => window.location.reload(true));
    };
  }

  render() {
    let preguntas = this.state.preguntas;
    let sugerencias = this.state.sugerencias;
    let cantPreguntas = preguntas.length;
    let cantSugerencias = sugerencias.length;

    moment.locale("es");
    let fechaC = moment(new Date(this.state.fecha_creacion)).format(
      "YYYY-MM-DD"
    );
    let horaC = moment(new Date(this.state.fecha_creacion)).format("LT");

    let fechaM = moment(new Date(this.state.fecha_modificacion)).format(
      "YYYY-MM-DD"
    );
    let horaM = moment(new Date(this.state.fecha_modificacion)).format("LT");

    return (
      <>
        <Container className="my-5">
          <Row>
            <Container style={{ display: "inline-flex" }}>
              <Link
                className="link"
                to="/Trivias"
                style={{ marginRight: "1em", marginTop: "0.6em" }}
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
                <h3>Detalle Trivia</h3>
              </Col>
              <Col>
                <Link to="/Trivias">
                  <Button outline color="danger" style={{ margin: 0 }}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      size="2x"
                      onClick={this.eliminarTrivia(this.props.match.params.id)}
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
                <Row className="mt-3">
                  <Col>
                    <FormGroup>
                      <Label for="triviaNombre" className="titulo">
                        Nombre
                      </Label>
                      <Input
                        type="nombre"
                        name="nombre"
                        id="triviaNombre"
                        placeholder="Nombre de la Trivia"
                        value={this.state.nombre}
                        onChange={this.onInputchange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <FormGroup>
                      <Label for="triviaDescripcion" className="titulo">
                        Descripción
                      </Label>
                      <Input
                        type="textarea"
                        name="descripcion"
                        id="triviaDescripcion"
                        value={this.state.descripcion}
                        onChange={this.onInputchange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <FormGroup>
                      <Label for="triviaMaterial" className="titulo">
                        Material de Apoyo
                      </Label>
                      <Input
                        type="text"
                        name="material_apoyo"
                        id="triviaMaterial"
                        placeholder="Material de Apoyo"
                        value={this.state.material_apoyo}
                        onChange={this.onInputchange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <FormGroup>
                      <Label for="fechaCreacion" className="titulo">
                        Fecha Creación
                      </Label>
                      <Row>
                        <Col>
                          <Input
                            type="date"
                            name="date"
                            id="fechaCreacion"
                            format="dd-MM-yyyy"
                            value={fechaC}
                            disabled
                          />
                        </Col>
                        <Col>
                          <Input
                            type="time"
                            name="time"
                            id="horaCreacion"
                            value={horaC}
                            disabled
                          />
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="fechaModificacion" className="titulo">
                        Fecha Modificación
                      </Label>
                      <Row>
                        <Col>
                          <Input
                            type="date"
                            name="date"
                            id="fechaModificacion"
                            placeholder="date placeholder"
                            value={fechaM}
                            disabled
                          />
                        </Col>
                        <Col>
                          <Input
                            type="time"
                            name="time"
                            id="horaModificacion"
                            placeholder="time placeholder"
                            value={horaM}
                            disabled
                          />
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
              <br />
              <Row>
                <Col xs="9">
                  <h6
                    className="titulo"
                    style={{ paddingTop: "0.8em", paddingBottom: 0 }}
                  >
                    Preguntas ({cantPreguntas})
                  </h6>
                </Col>
                <Col xs="3" align="end">
                  <Link
                    to={"/Pregunta/" + this.props.match.params.id}
                    style={{ textDecoration: "none" }}
                  >
                    <Button id="btnAgregar">
                      <FontAwesomeIcon icon={faPlusCircle} /> Agregar
                    </Button>
                  </Link>
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

              <ListGroup>
                {preguntas.map(({ enunciado, _id }) => (
                  <ListGroupItem key={_id}>
                    <Row>
                      <Col sm="11">{enunciado}</Col>
                      <Col>
                        <Link to={"/VerPregunta/" + _id}>
                          <FontAwesomeIcon icon={faEye} className="icono" />
                        </Link>
                      </Col>
                      <Col>
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="icono  "
                          onClick={this.eliminarPregunta(_id)}
                        />
                      </Col>
                    </Row>
                  </ListGroupItem>
                ))}
              </ListGroup>
              <Row>
                <Col xs="9">
                  <h6
                    className="titulo"
                    style={{ paddingTop: "0.8em", paddingBottom: 0 }}
                  >
                    Sugerencias ({cantSugerencias})
                  </h6>
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

              <ListGroup>
                {sugerencias.map(({ enunciado, _id }) => (
                  <ListGroupItem key={_id}>
                    <Row>
                      <Col sm="11">{enunciado}</Col>
                      <Col>
                        <Link to={"/VerSugerencia/" + _id}>
                          <FontAwesomeIcon icon={faEye} className="icono" />
                        </Link>
                      </Col>
                      <Col>
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="icono"
                          onClick={this.eliminarPregunta(_id)}
                        />
                      </Col>
                    </Row>
                  </ListGroupItem>
                ))}
              </ListGroup>
              <Row className="text-center">
                <Col className="mt-3">
                  <Link to={"/Trivias"}>
                    <Button
                      id="btnGuardarCambios"
                      onClick={this.guardarCambios}
                    >
                      Guardar Cambios
                    </Button>
                  </Link>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </>
    );
  }
}

export default VerTrivia;
