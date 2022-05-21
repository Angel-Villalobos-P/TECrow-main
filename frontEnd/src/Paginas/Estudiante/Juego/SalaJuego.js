import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

//Componentes
import CardSalaJuego from "../../../Componentes/Card/CardSalaJuego";

//iconos
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; //biblioteca
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons"; //volver
import { faClock } from "@fortawesome/free-solid-svg-icons"; //reloj
import { faQuestion } from "@fortawesome/free-solid-svg-icons"; //preguntas
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons"; //calendario

//api
import axios from "axios";

//estilos
import {
  Container,
  Row,
  Col,
  Spinner,
  Card,
  CardImg,
  Label,
  Input,
  Button,
} from "reactstrap";
import "./SalaJuego.css";

//Bibliotecas de tiempo
import moment from "moment";
import "moment/locale/es";

class SalaJuego extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grupo: "",
      juego: null,
      loading: false,
      idJuego: this.props.location.state.idJuego,
      preguntas: [],
      id_usuario: null,
      respuestas: [],
    };
  }

  componentDidMount() {
    this.cargarJuego();
    this.obtenerUsuario();
    moment.locale("es");
  }

  obtenerUsuario = async () => {
    try {
      var self = this;
      const data = axios.get("/obtenerInformacionHeader").then(function (res) {
        if (res.data.sesionIniciada === true) {
          self.state.id_usuario = res.data.correoElectronico;
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  cargarJuego = async () => {
    try {
      var idGrupo; //realizar reemplazo
      const data = await axios
        .get("/extraerJuego/" + this.props.location.state.idJuego)
        .then((res) => {
          idGrupo = res.data.id_grupo;
          this.setState({ juego: res.data });
        });
      const grupo = await axios.get("/grupo/" + idGrupo).then((resGrupo) => {
        this.setState({ grupo: resGrupo.data.grupo });
      });

      this.setState({ loading: true });
    } catch (e) {
      console.log(e);
    }
  };

  extraerPreguntas = async () => {
    try {
      var self = this;
      const data = await axios
        .post("/extraerPreguntas/" + this.state.juego.id_trivia, {
          idTrivia: self.state.juego.id_trivia,
        })
        .then(function (res) {
          var preguntasMap = [];
          for (var i = 0; i < res.data.length; i++) {
            if (!res.data[i].esSugerencia) preguntasMap.push(res.data[i]);
          }
          self.state.preguntas = preguntasMap;
          self.crearRespuestaJuego();
        });
    } catch (e) {
      console.log(e);
    }
  };

  crearRespuestaJuego = async () => {
    try {
      var self = this;
      axios
        .post("/crearRespuestaJuego/", {
          id_trivia: this.state.juego.id_trivia,
          id_juego: this.props.location.state.idJuego,
          id_usuario: this.state.id_usuario,
          preguntas: this.state.preguntas,
        })
        .then((response) => {
          var preguntasMap = [];
          for (var i = 0; i < response.data.length; i++) {
            if (!response.data[i].esSugerencia)
              preguntasMap.push(response.data[i]);
          }
          self.state.preguntas = preguntasMap;
          self.state.respuestas = response.data;
          self.props.history.push({
            pathname: `/Partida`,
            state: {
              initialTime: this.state.juego.tiempo_por_pregunta,
              id_trivia: this.state.juego.id_trivia,
              id_juego: this.props.location.state.idJuego,
              id_usuario: this.state.id_usuario,
              cant_preguntas: this.state.juego.preguntas_por_partida,
              respuestas: this.state.respuestas,
            },
          });
          console.log(response.data);
        });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <>
        <Container className="my-5">
          <Row>
            <Container style={{ display: "inline-flex" }}>
              <Link
                className="link"
                to="/JuegosE"
                style={{ marginRight: "1em" }}
              >
                <FontAwesomeIcon
                  className="homeLink"
                  icon={faArrowCircleLeft}
                  size="2x"
                />
              </Link>
              <Col xs="6" className="text-start">
                <h3>Sala de juego </h3>
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
          {/* aqui va el spinner */}
          {!this.state.loading ? (
            <Row className="spinner mt-5">
              <Spinner color="#002A59" />
            </Row>
          ) : (
            <>
              {this.state.juego.imagen ? (
                <>
                  <Row className="justify-content-center">
                    <Col xs="6">
                      <Card>
                        <CardImg
                          top
                          width="100%"
                          className="imagenTrivia"
                          src={this.state.juego.imagen}
                          alt="Card image cap"
                        />
                      </Card>
                    </Col>
                  </Row>
                </>
              ) : null}
              <Row className="mt-3">
                <Col>
                  <Label for="triviaNombre" className="titulo">
                    Juego
                  </Label>
                  <Input
                    defaultValue={this.state.juego.nombre}
                    readOnly={true}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Label for="triviaNombre" className="titulo">
                    Grupo
                  </Label>
                  <Input
                    defaultValue={this.state.grupo.nombre}
                    readOnly={true}
                  />
                </Col>
              </Row>
              {/* aqui van las 3 cards */}
              <Row className="mt-5">
                <div className="col-md-4">
                  <CardSalaJuego
                    icono={faQuestion}
                    titulo={"Preguntas por partida"}
                    descripcion={
                      this.state.juego.preguntas_por_partida + " preguntas"
                    }
                    color={"#002A59"}
                  />
                </div>
                <div className="col-md-4">
                  <CardSalaJuego
                    icono={faClock}
                    titulo={"Tiempo por pregunta"}
                    descripcion={
                      this.state.juego.tiempo_por_pregunta + " segundos"
                    }
                    color={"#00C1AF"}
                  />
                </div>
                <div className="col-md-4">
                  <CardSalaJuego
                    icono={faCalendarAlt}
                    color={"#EADC77"}
                    titulo={"Tiempo restante"}
                    descripcion={
                      "Cierra " +
                      moment(this.state.juego.fecha_cierre)
                        .endOf("day")
                        .fromNow()
                    }
                  />
                </div>
              </Row>
              <Container className="btn">
                <Link to="/JuegosE">
                  <Button id="btnRegistrar">Volver</Button>
                </Link>
                <Link
                  to={{
                    pathname: "/CrearSugerencia",
                    state: {
                      id_trivia: this.state.juego.id_trivia,
                      id_juego: this.state.idJuego,
                    },
                  }}
                >
                  <Button id="btnRegistrar"> Sugerir una pregunta </Button>
                </Link>
                {/* <Link
                  to={{
                    pathname: "/Partida",
                    state: {
                      initialTime: this.state.juego.tiempo_por_pregunta,
                      id_trivia: this.state.juego.id_trivia,
                      id_juego: this.props.location.state.idJuego,
                      id_usuario: this.state.id_usuario,
                      cant_preguntas: this.state.juego.preguntas_por_partida,
                      respuestas: this.state.respuestas,
                    },
                  }}
                > */}
                <Button id="btnCancelar" onClick={this.extraerPreguntas}>
                  Jugar
                </Button>
                {/* </Link> */}
              </Container>
            </>
          )}
        </Container>
      </>
    );
  }
}

export default withRouter(SalaJuego);
