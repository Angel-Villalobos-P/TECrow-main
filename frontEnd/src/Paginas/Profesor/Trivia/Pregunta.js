import React, { Component, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import "./Trivias.css";
import "./CrearTrivia.css";
import ImageLoader from "../../../Componentes/imageLoader/imageLoader";

//icon imports
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
//fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button, Form, FormGroup, Label, Input, Container, Col, Row, Card, CardBody, CardTitle, InputGroup, InputGroupAddon } from "reactstrap";

var imagen = "";

class Pregunta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id_trivia: this.props.match.params.id,
      enunciado: "",
      audiovisual: "",
      esSugerencia: false,
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

    this.registrarPregunta = this.registrarPregunta.bind(this);
    this.subirImagen = this.subirImagen.bind(this);
    this.onInputchange = this.onInputchange.bind(this);
  }

  setImgPath(path) {
    this.state.audiovisual = path;
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

  // Hace push de la imagen a Cloudinary
  subirImagen = (e) => {
    if (this.state.audiovisual !== "" && this.state.audiovisual !== null) {
      e.preventDefault();
      // alert(this.state.audiovisual);
      const formData = new FormData();
      formData.append("file", this.state.audiovisual);
      formData.append("upload_preset", "p8vfboo9");

      axios
        .post("https://api.cloudinary.com/v1_1/tecrow/image/upload", formData)
        .then((response) => {
          imagen = response.data.url;
          // console.log(response);
          this.registrarPregunta();
        });
    } else {
      this.registrarPregunta();
    }
  };

  registrarPregunta() {
    var data = this.state;
    var id_trivia = data.id_trivia;
    var enunciado = data.enunciado;
    var audiovisual = imagen;
    var esSugerencia = data.esSugerencia;
    var opciones = data.opciones;

    let obj = {
      id_trivia,
      enunciado,
      audiovisual,
      esSugerencia,
      opciones,
    };

    if (enunciado !== "" && data.opciones[0].respuesta !== "" && data.opciones[1].respuesta !== "") {
      axios.post("/crearPregunta", obj).then(function (res) {
        if (!res.data.success) alert(res.data.error);
        else alert(res.data.message);
      });
    }
    else {
      alert("Faltan datos");
    }
  }

  render() {
    return (
      <>
        <Container className="my-5">
          <Row>
            <Container style={{ display: "inline-flex" }}>
              <Link
                className="link"
                to={"/VerTrivia/" + this.props.match.params.id}
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
                          onChange={this.onInputchange}
                        />
                      </FormGroup>
                    </CardTitle>
                  </CardBody>
                  <FormGroup>
                    <ImageLoader setImgPath={(path) => this.setImgPath(path)} />
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
                      value={this.state.opciones[0].respuesta}
                      onChange={(event) => this.inputRespuesta(0, event)}
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
                      onChange={(event) => this.inputRespuesta(1, event)}
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
                      onChange={(event) => this.inputRespuesta(2, event)}
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
                      onChange={(event) => this.inputRespuesta(3, event)}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row className="text-center">
              <Col className="mt-3">
                <Link to={"/VerTrivia/" + this.props.match.params.id}>
                  <Button id="btnRegistrar" onClick={this.subirImagen}>
                    Registrar
                  </Button>
                </Link>
              </Col>
            </Row>
          </Form>
        </Container>
      </>
    );
  }
}

export default Pregunta;
