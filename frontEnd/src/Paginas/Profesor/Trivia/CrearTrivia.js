import React, { useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Form, FormGroup, Label, Input, Container, Col, Row, Button } from "reactstrap";

import ImageLoader from "../../../Componentes/imageLoader/imageLoader";
import axios from "axios";
import moment from "moment";
import "moment/locale/es";
import "./CrearTrivia.css";
function CrearTrivia() {
  //usuario
  const [idUsuario, setIdUsuario] = useState(null);
  //inputs
  const [nombre, setNombre] = useState(null);
  const [descripcion, setDescripcion] = useState(null);
  const [materialApoyo, setMaterialApoyo] = useState(null);
  //resultado
  //const [mensaje, setMensaje] = useState(null);

  //imagen
  const [imgPath, setImgPath] = useState(null);
  var imagen = "";

  //Handle inputs
  const handleInputNombre = (event) => {
    setNombre(event.target.value);
  };

  const handleInputDescripcion = (event) => {
    setDescripcion(event.target.value);
  };

  const handleInputMaterialApoyo = (event) => {
    setMaterialApoyo(event.target.value);
  };

  // Hace push de la imagen a Cloudinary
  const subirImagen = (e) => {
    if (imgPath !== null) {
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", imgPath);
      formData.append("upload_preset", "p8vfboo9");

      axios
        .post("https://api.cloudinary.com/v1_1/tecrow/image/upload", formData)
        .then((response) => {
          imagen = response.data.url;
          console.log(response);
          registrarTrivia();
        });
    } else {
      registrarTrivia();
    }
  };
  //Consolida la trivia en la base de datos
  const registrarTrivia = () => {
    //var idUsuario = "admin@gmail.com";
    var fecha_creacion = moment().format();
    var fecha_modificacion = moment().format();
    var material_apoyo = materialApoyo;

    var obj = {
      nombre,
      descripcion,
      fecha_creacion,
      fecha_modificacion,
      imagen,
      material_apoyo,
    };

    var post = axios.post("/crearTrivia", obj);

    post.then(function (res) {
      if (!res.data.success) alert(res.data.error);
      else alert(res.data.message);
    });
  };
  return (
    <>
      <Container className="my-5">
        <Row>
          <Container style={{ display: "inline-flex" }}>
            <Link className="link" to="/Trivias" style={{ marginRight: "1em" }}>
              <FontAwesomeIcon
                className="homeLink"
                icon={faArrowCircleLeft}
                size="2x"
              />
            </Link>
            <Col xs="6" className="text-start">
              <h3>Crear Trivia</h3>
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
        <Form onSubmit={registrarTrivia}>
          <Row className="justify-content-center">
            <Col xs="6" style={{ marginBottom: "1em" }}>
              <FormGroup>
                <ImageLoader setImgPath={(path) => setImgPath(path)} />
              </FormGroup>
            </Col>
          </Row>
          <br />

          <FormGroup>
            <Label for="nombre_trivia" className="titulo">
              Nombre
            </Label>
            <Input
              type="text"
              name="nombre"
              id="nombre_trivia"
              placeholder="Nombre de trivia"
              className="input"
              onChange={handleInputNombre}
            />
          </FormGroup>
          <FormGroup>
            <Label for="descripcion" className="titulo">
              Descripción
            </Label>
            <Input
              type="textarea"
              name="text"
              id="descripcion"
              className="input"
              placeholder="Descripcion de trivia"
              onChange={handleInputDescripcion}
            />
          </FormGroup>
          <FormGroup>
            <Label for="material_apoyo" className="titulo">
              Material de apoyo
            </Label>
            <Input
              type="url"
              name="material"
              id="material_apoyo"
              placeholder="Enlace (url) al material de refuerzo"
              className="input"
              onChange={handleInputMaterialApoyo}
            />
          </FormGroup>
        </Form>
        <Container className="btn">
          <Button id="btnRegistrar" onClick={subirImagen}>
            Registrar
          </Button>
          <Button id="btnCancelar"> Cancelar </Button>
        </Container>
      </Container>
    </>
  );
}

export default CrearTrivia;
