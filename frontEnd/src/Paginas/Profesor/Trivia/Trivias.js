import React, { Component } from "react";
import { Link } from "react-router-dom";

//import "./Grupos.css";
import Card from "../../../Componentes/Card/CardTrivia.js";
import axios from "axios";

import { Container, Row, Spinner } from "reactstrap";

//icon imports
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

//fontAwesome import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardAgregar from "../../../Componentes/Card/CardAgregar.js";

import DefaultImage from "./TriviaDefaultImage.png";

class Trivias extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trivias: [],
      loading: false,
      esProfesor: null,
      sesionIniciada: false,
    };
  }

  componentDidMount() {
    var self = this;
    try {
      const data = axios.get("/obtenerInformacionHeader").then(function (res) {
        if (res.data.sesionIniciada === true) {
          self.setState({
            sesionIniciada: true,
            esProfesor: res.data.tipoUsuario === "Profesor" ? true : false,
          });
          self.cargarTrivias();
        } else self.setState({ sesionIniciada: false });
      });
    } catch (e) {
      console.log(e);
    }
  }

  cargarTrivias = async () => {
    var self = this;
    try {
      const data = await axios
        .post("/extraerTrivias", {
          pIdUsuario: self.state.idUsuario,
        })
        .then(function (res) {
          if (res.data != []) {
            self.setState({ trivias: res.data });
          }
        });
    } catch (e) {
      console.log(e);
    }
    self.setState({ loading: true });
  };

  onChange = (e) =>
    this.setState({
      [e.target.name]: e.target.value,
    });

  render() {
    let displayCards = this.state.trivias.sort(
      (a, b) => b.fecha_creacion - a.fecha_creacion
    );
    return (
      <>
        <Container className="my-5">
          <Row>
            <Container style={{ display: "inline-flex" }}>
              <Link className="link" to="/dashboard">
                <FontAwesomeIcon
                  className="homeLink"
                  style={{ marginRight: "0.5em" }}
                  icon={faArrowCircleLeft}
                  size="2x"
                />
              </Link>
              <h3>Trivia</h3>
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
              <div className="container grid justify-content-center align-items-center">
                <div className="row">
                  {this.state.esProfesor && (
                    <div className="col-md-4">
                      <Link
                        to="/CrearTrivia"
                        style={{ textDecoration: "none" }}
                      >
                        <CardAgregar seccion="Crear Trivia" />
                      </Link>
                    </div>
                  )}

                  {displayCards.map(
                    ({ _id, imagen, nombre, fecha_creacion }) => (
                      <div className="col-md-4" key={_id}>
                        <Link
                          to={"/VerTrivia/" + _id}
                          style={{ textDecoration: "none" }}
                        >
                          <Card
                            className="cardGrupo"
                            id={_id}
                            imagen={imagen === "" ? DefaultImage : imagen}
                            nombre={nombre}
                            fecha_creacion={fecha_creacion}
                          />
                        </Link>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}
        </Container>
      </>
    );
  }
}

export default Trivias;
