import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Button,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";

const default_image =
  "https://raw.githubusercontent.com/FaztWeb/react-cards-bootstrap/main/src/assets/image2.jpg";

class UnionGrupo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codigoValido: false,
      codigo: "",
      grupo: {
        _id: "",
        nombre: "",
        imagen: default_image,
      },
    };
    this.cambioCodigo = this.cambioCodigo.bind(this);
    this.incorporarse = this.incorporarse.bind(this);
  }
  cambioCodigo(e) {
    const newVal = e.target.value;
    this.setState({ codigo: newVal });
    axios.get("/verGrupoParaIncorporarse/" + newVal).then((res) => {
      if (!!res.data.grupo) {
        this.setState({ grupo: res.data.grupo });
      } else {
        var grupo = this.state.grupo;
        grupo.imagen = default_image;
        grupo.nombre = "";
        this.setState({ grupo });
      }
    });
  }
  incorporarse() {
    if (this.state.grupo.imagen === default_image)
      alert("No se pudo incorporar porque el grupo no existe");
    else
      axios.post("/incorporarse/" + this.state.grupo._id).then((res) => {
        if (res.data.exito) alert("Incorporado con éxito.");
        else alert("Ya eres es miembro de ese grupo.");
      });
  }
  render() {
    return (
      <html>
        <Container className="my-5">
          <Row>
            <Container style={{ display: "inline-flex" }}>
              <Link
                className="link"
                to="/grupos"
                style={{ marginRight: "1em" }}
              >
                <FontAwesomeIcon
                  className="homeLink"
                  icon={faArrowCircleLeft}
                  size="2x"
                />
              </Link>
              <Col xs="6" className="text-start">
                <h3>Unirse a un grupo</h3>
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
          <br />
          <Row>
            <Col xs="3" />
            <Col xs="6">
              <Container>
                <Row>
                  <Col xs="1" />
                  <Col>
                    <Card>
                      <CardImg
                        top
                        width="100%"
                        src={this.state.grupo.imagen}
                        alt="Vista previa del grupo"
                      />
                      <CardBody>
                        <CardTitle tag="h5">
                          {this.state.grupo.nombre}
                        </CardTitle>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col xs="1" />
                </Row>
                <Row>
                  <h5>
                    <br />
                    Ingrese el código de grupo al que desea unirse
                  </h5>
                  <br />
                  <Input
                    onChange={this.cambioCodigo}
                    value={this.state.codigo}
                    placeholder="Código de grupo"
                  ></Input>
                  <br />
                </Row>
                <Row>
                  <Col xs="3" />
                  <Col xs="6">
                    <Row>
                      <Button
                        style={{ marginTop: "12px" }}
                        onClick={this.incorporarse}
                        color="info"
                      >
                        Incorporarse
                      </Button>
                    </Row>
                  </Col>
                  <Col xs="3" />
                </Row>
              </Container>
            </Col>
            <Col xs="3" />
          </Row>
        </Container>
      </html>
    );
  }
}

export default UnionGrupo;
