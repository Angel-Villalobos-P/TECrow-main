import React, { Component } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import "./Trivias.css";
import "./CrearTrivia.css";

//icon imports
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
//fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Button, Form, FormGroup, Label, Input, Container, Col, Row, Card,
  CardBody, CardTitle, InputGroup, InputGroupAddon, CardImg
} from "reactstrap";

var imagen = "";

class VerSugerencia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_pregunta: this.props.match.params.id,
      id_trivia: "",
      enunciado: "",
      audiovisual: "",
      esSugerencia: true,
      opciones: [
        {
          id: 0,
          respuesta: "",
          esCorrecta: true,
        },
        {
          id: 1,
          respuesta: "",
          esCorrecta: false,
        },
        {
          id: 2,
          respuesta: "",
          esCorrecta: false,
        },
        {
          id: 3,
          respuesta: "",
          esCorrecta: false,
        },
      ],
    };

    axios.get("/extraerPregunta/" + this.state.id_pregunta).then((res) => {
      this.setState({
        id_trivia: res.data.id_trivia,
        enunciado: res.data.enunciado,
        audiovisual: res.data.audiovisual,
        esSugerencia: res.data.esSugerencia,
        opciones: res.data.opciones,
      });
    });

    this.aceptarPregunta = this.aceptarPregunta.bind(this);
    this.rechazarPregunta = this.rechazarPregunta.bind(this);

    //this.cambiarImagen = this.cambiarImagen.bind(this);
    this.onInputchange = this.onInputchange.bind(this);
  }

  onInputchange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  inputRespuesta = (id, event) => {
    //event.preventDefault();
    const { opciones } = this.state;

    const index = opciones.findIndex((element) => element.id === id);
    opciones[index].respuesta = event.target.value;

    this.setState({ opciones });
  };

  aceptarPregunta() {
    var data = this.state;
    var id_trivia = data.id_trivia;
    var enunciado = data.enunciado;
    var audiovisual = data.audiovisual;
    var esSugerencia = false;
    var opciones = data.opciones;

    let obj = {
      id_trivia,
      enunciado,
      audiovisual,
      esSugerencia,
      opciones,
    };

    axios
      .patch("/actualizarPregunta/" + this.props.match.params.id, {
        pregunta: obj,
      })
      .then(function (res) {
        alert("La pregunta se ha agregado a la trivia!");
      });
  }

  rechazarPregunta() {
      axios
        .delete("/eliminarPregunta/" + this.props.match.params.id)
        .then(function(res){
          alert("Se ha eliminado la sugerencia!");
          window.location.reload(false);
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
                          disabled
                        />
                      </FormGroup>
                    </CardTitle>
                  </CardBody>
                  <Card>
                    <CardImg
                      top
                      width="100%"
                      className="imagenTrivia"
                      src={this.state.audiovisual}
                      alt="Card image cap"
                    />
                  </Card>
                  {/*} <FormGroup>
                    <ImageLoader
                      imagen={this.state.audiovisual}
                      setImgPath={(path) => this.setImgPath(path)}
                    />
                  </FormGroup>
                      */}
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
                      value={this.state.opciones[0].respuesta}
                      disabled
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
                      value={this.state.opciones[1].respuesta}
                      disabled
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
                      value={this.state.opciones[2].respuesta}
                      disabled
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
                      value={this.state.opciones[3].respuesta}
                      disabled
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row className="text-center">
              <Col className="mt-3">
                <Container className="btn">
                  <Link to={"/VerTrivia/" + this.state.id_trivia}>
                    <Button id="btnCancelar" onClick={this.rechazarPregunta}> Rechazar pregunta </Button>
                  </Link>
                  <Link to={"/VerTrivia/" + this.state.id_trivia}>
                    <Button id="btnRegistrar" onClick={this.aceptarPregunta}>
                      Aceptar nueva pregunta
                    </Button>
                  </Link>
                </Container>
              </Col>
            </Row>
          </Form>
        </Container>
      </>
    );
  }
}

export default VerSugerencia;
