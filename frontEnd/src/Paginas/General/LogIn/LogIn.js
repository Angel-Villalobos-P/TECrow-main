import React, { Component, useState } from "react";
import { Link, Route } from "react-router-dom";

import fire from "../../../fire.js";
import axios from "axios";
import "./Login.css";

import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Col,
  Row,
} from "reactstrap";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LogIn = () => {
  const [usuario, setUsuario] = useState();
  const [contrasenia, setContrasenia] = useState();

  const iniciarSesion = (e) => {
    e.preventDefault();
    var self = this;
    axios
      .post("iniciarSesion", {
        pUsuario: usuario,
        pContrasenia: contrasenia,
      })
      .then(function (res) {
        if (!res.data.success) alert(res.data.error);
        else {
          fire
            .auth()
            .signInWithEmailAndPassword(res.data.usuario, contrasenia)
            .then((loggedInUser) => {
              window.location.href = "/dashboard";
            })
            .catch((error) => {
              alert("Nombre de usuario o contraseña incorrectos");
            });
        }
      });
  };

  return (
    <div>
      <Container className="my-5">
        <Row>
          <Container style={{ display: "inline-flex" }}>
            <Link
              className="link"
              to="/principal"
              style={{ marginRight: "1em" }}
            >
              <FontAwesomeIcon
                className="homeLink"
                icon={faArrowCircleLeft}
                size="2x"
              />
            </Link>
            <Col xs="6" className="text-start">
              <h3>Iniciar sesión</h3>
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
          <Col xs="6">
            <Form inline>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="correo" className="mr-sm-2">
                  Correo electrónico
                </Label>
                <Input
                  type="email"
                  name="correo"
                  onChange={({ target }) => setUsuario(target.value)}
                  placeholder="ejemplo@gmail.com"
                />
              </FormGroup>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Label for="contrasenia" className="mr-sm-2">
                  Contraseña
                </Label>
                <Input
                  type="password"
                  name="contrasenia"
                  onChange={({ target }) => setContrasenia(target.value)}
                />
              </FormGroup>
              <Container className="btn">
                <Button id="btnLogin" onClick={iniciarSesion}>
                  Iniciar Sesión
                </Button>
                <Button id="btnRegistrar" href="/registro">
                  Registrarse
                </Button>
              </Container>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LogIn;
