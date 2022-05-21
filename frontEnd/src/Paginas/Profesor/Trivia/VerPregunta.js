import React, { Component } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import "./Trivias.css";
import "./CrearTrivia.css";
import ImageLoader from "../../../Componentes/imageLoader/imageLoader";

//icon imports
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
//fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  CardBody,
  CardTitle,
  InputGroup,
  InputGroupAddon,
  Spinner,
} from "reactstrap";

var imagen = "";

class VerPregunta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_pregunta: this.props.match.params.id,
      id_trivia: "",
      enunciado: "",
      loading: false,
      audiovisual: "",
      esSugerencia: false,
      opciones: [],
      respuestaA: "",
      respuestaB: "",
      respuestaC: "",
      respuestaD: "",
    };

    this.modificarPregunta = this.modificarPregunta.bind(this);
    this.cambiarImagen = this.cambiarImagen.bind(this);
    this.onInputchange = this.onInputchange.bind(this);
  }
  componentDidMount() {
    var self = this;
    try {
      const data = axios
        .get("/extraerPregunta/" + this.state.id_pregunta)
        .then((res) => {
          self.setState({
            id_trivia: res.data.id_trivia,
            enunciado: res.data.enunciado,
            audiovisual: res.data.audiovisual,
            esSugerencia: res.data.esSugerencia,
            opciones: res.data.opciones,
          });
          this.cargarOpciones();
          self.setState({ loading: true });
        });
    } catch (e) {
      console.log(e);
    }
  }

  cargarOpciones = async () => {
    this.state.opciones.forEach((element, i) => {
      if (i === 0) {
        this.state.respuestaA = element.respuesta;
      }
      if (i === 1) {
        this.state.respuestaB = element.respuesta;
      }
      if (i === 2) {
        this.state.respuestaC = element.respuesta;
      }
      if (i === 3) {
        this.state.respuestaD = element.respuesta;
      }
    });
  };

  setImgPath(path) {
    this.state.audiovisual = path;
  }

  onInputchange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // Hace push de la imagen a Cloudinary
  cambiarImagen = (e) => {
    if (this.state.audiovisual !== "" && this.state.audiovisual !== null) {
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", this.state.audiovisual);
      formData.append("upload_preset", "p8vfboo9");

      axios
        .post("https://api.cloudinary.com/v1_1/tecrow/image/upload", formData)
        .then((response) => {
          imagen = response.data.url;
          // console.log(response);
          this.modificarPregunta();
        });
    } else {
      this.modificarPregunta();
    }
  };

  modificarPregunta() {
    var data = this.state;
    var id_trivia = data.id_trivia;
    var enunciado = data.enunciado;
    var audiovisual = data.audiovisual;
    var esSugerencia = data.esSugerencia;
    var opciones = data.opciones.forEach((element, i) => {
      if (i === 0) {
        element.respuesta = data.respuestA;
      }
      if (i === 1) {
        element.respuesta = data.respuestaB;
      }
      if (i === 2) {
        element.respuesta = data.respuestaC;
      }
      if (i === 3) {
        element.respuesta = data.respuestaD;
      }
    });

    var opciones = [
      {
        respuesta: data.respuestaA,
        esCorrecta: true,
      },
      {
        respuesta: data.respuestaB,
        esCorrecta: false,
      },
      {
        respuesta: data.respuestaC,
        esCorrecta: false,
      },
      {
        respuesta: data.respuestaD,
        esCorrecta: false,
      },
    ];

    let obj = {
      id_trivia,
      enunciado,
      audiovisual,
      esSugerencia,
      opciones,
    };

    //console.log(obj);

    axios
      .patch("/actualizarPregunta/" + this.props.match.params.id, {
        pregunta: obj,
      })
      .then(function (res) {
        if (!res.data.success) alert(res.data.error);
        else alert(res.data.message);
      });
  }

  render() {
    return (
      <>
        <Container className="my-5">
          <Row>
            <Container style={{ display: "inline-flex" }}>
              <Link
                className="link"
                to={"/VerTrivia/" + this.state.id_trivia}
                style={{ marginRight: "1em" }}
              >
                <FontAwesomeIcon
                  className="homeLink"
                  icon={faArrowCircleLeft}
                  size="2x"
                />
              </Link>
              <Col xs="6" className="text-start">
                <h3>Pregunta</h3>
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
                  <Col xs="8">
                    <Card>
                      <CardBody>
                        <CardTitle tag="h5" className="my-auto">
                          <FormGroup>
                            <Label for="enunciado" className="enunciadoA">
                              Enunciado
                            </Label>
                            <Input
                              type="text"
                              name="enunciado"
                              id="enunciado"
                              placeholder="Enunciado"
                              value={this.state.enunciado}
                              onChange={this.onInputchange}
                            />
                          </FormGroup>
                        </CardTitle>
                      </CardBody>
                      <FormGroup>
                        <ImageLoader
                          imagen={this.state.audiovisual}
                          setImgPath={(path) => this.setImgPath(path)}
                        />
                      </FormGroup>
                    </Card>
                  </Col>
                </Row>
                <br />
                <Row className="justify-content-center" xs="2">
                  <Col className="mt-3">
                    <FormGroup>
                      <InputGroup id="respuestaA">
                        <InputGroupAddon addonType="prepend">A</InputGroupAddon>
                        <Input
                          type="text"
                          name="respuestaA"
                          id="respuestaA"
                          placeholder="Respuesta Correcta"
                          value={this.state.respuestaA}
                          onChange={this.onInputchange}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col className="mt-3">
                    <FormGroup>
                      <InputGroup id="respuestaB">
                        <InputGroupAddon addonType="prepend">B</InputGroupAddon>
                        <Input
                          type="text"
                          name="respuestaB"
                          id="respuestaB"
                          placeholder="Respuesta Incorrecta"
                          value={this.state.respuestaB}
                          onChange={this.onInputchange}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col className="mt-3">
                    <FormGroup>
                      <InputGroup id="respuestaC">
                        <InputGroupAddon addonType="prepend">C</InputGroupAddon>
                        <Input
                          type="text"
                          name="respuestaC"
                          id="respuestaC"
                          placeholder="Respuesta Opcional"
                          value={this.state.respuestaC}
                          onChange={this.onInputchange}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col className="mt-3">
                    <FormGroup>
                      <InputGroup id="respuestaD">
                        <InputGroupAddon addonType="prepend">D</InputGroupAddon>
                        <Input
                          type="text"
                          name="respuestaD"
                          id="respuestaD"
                          placeholder="Respuesta Opcional"
                          value={this.state.respuestaD}
                          onChange={this.onInputchange}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="text-center">
                  <Col className="mt-3">
                    <Link to={"/VerTrivia/" + this.state.id_trivia}>
                      <Button
                        id="btnModificar"
                        onClick={this.modificarPregunta}
                      >
                        Modificar
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Form>
            </>
          )}
        </Container>
      </>
    );
  }
}

export default VerPregunta;
