import React from "react";
import { Link, useHistory } from "react-router-dom";

import "./VerGrupo.css";
import ImageLoader from "../../../Componentes/imageLoader/imageLoader";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import {
  faArrowCircleLeft,
  faBan,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Col,
  Row,
  Card,
  CardImg,
  CardBody,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippy.js/react";
import "tippy.js/dist/tippy.css";

class VerGrupo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      miembroParaAnadir: "",
      imageDidChange: false,
      grupo: {
        nombre: "",
        estado: true,
        codigo: "",
        estudiantes: [],
        juegos: [],
        fecha_creacion: "",
        fecha_ultima_modificacion: "",
        imagen:
          "https://raw.githubusercontent.com/FaztWeb/react-cards-bootstrap/main/src/assets/image2.jpg",
      },
      esProfesor: false,
    };
    axios.get("/grupo/" + this.props.match.params.id).then((res) => {
      this.setState({ grupo: res.data.grupo });
    });
    axios
      .get("/obtenerInformacionHeader")
      .then((res) =>
        this.setState({ esProfesor: res.data.tipoUsuario === "Profesor" })
      );
    this.save = this.save.bind(this);
    this.eliminarGrupo = this.eliminarGrupo.bind(this);
    this.agregarMiembro = this.agregarMiembro.bind(this);
    this.cambioNombre = this.cambioNombre.bind(this);
    this.cambioActivo = this.cambioActivo.bind(this);
    this.cambioMiembroParaAnadir = this.cambioMiembroParaAnadir.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.setImgPath = this.setImgPath.bind(this);
    console.log(this.state.grupo);
  }
  save() {
    var grupo = this.state.grupo;
    grupo.fecha_ultima_modificacion = new Date().toISOString();
    this.subirImagen();
    axios.patch("/grupo/" + this.props.match.params.id, {
      grupo: {
        nombre: grupo.nombre,
        estado: grupo.estado,
        codigo: grupo.codigo,
        estudiantes: grupo.estudiantes,
        juegos: grupo.juegos,
        fecha_creacion: grupo.fecha_creacion,
        fecha_ultima_modificacion: grupo.fecha_ultima_modificacion,
        imagen: grupo.imagen,
      },
    });
  }
  eliminarGrupo() {
    if (this.state.esProfesor) {
      function del(id) {
        //función que devuelve otra función para eliminar el grupo respectivo
        return () =>
          axios
            .delete("/grupo/" + id)
            .then(() => window.location.reload(false));
      }
      return (
        <Link to="/grupos">
          <Button outline color="danger">
            <FontAwesomeIcon
              icon={faTrash}
              size="2x"
              onClick={del(this.props.match.params.id)}
            />
          </Button>
        </Link>
      );
    } else return <></>;
  }
  cambioMiembroParaAnadir(e) {
    this.setState({ miembroParaAnadir: e.target.value });
  }
  cambioActivo(e) {
    var activo = this.state.grupo;
    activo.estado = e.target.checked;
    this.setState({ activo });
  }
  cambioNombre(e) {
    if (this.state.esProfesor) {
      var grupo_ = this.state.grupo;
      grupo_.nombre = e.target.value;
      this.setState({ grupo_ });
    }
  }
  agregarMiembro() {
    if (
      this.state.miembroParaAnadir != "" &&
      this.state.grupo.estudiantes.indexOf(this.state.miembroParaAnadir) === -1
    ) {
      axios
        .get("/estudianteParaAniadirAGrupo/" + this.state.miembroParaAnadir)
        .then((res) => {
          if (res.data.sePuedeAniadir) {
            var grupo = this.state.grupo;
            grupo.estudiantes.push(this.state.miembroParaAnadir);
            this.setState({ grupo });
            alert("Estudiante añadido con éxito.\n");
          } else alert("No se encontró un miembro con ese carnet.\n");
          this.setState({ miembroParaAnadir: "" });
        });
    }
  }
  eliminar(miembro) {
    return () => {
      var grupo = this.state.grupo;
      grupo.estudiantes = grupo.estudiantes.filter((val, i, arr) => {
        return val !== miembro;
      });
      this.setState({ grupo });
    };
  }
  setImgPath(path) {
    var g = this.state.grupo;
    g.imagen = path;
    this.setState({ grupo: g, imageDidChange: true });
  }
  subirImagen() {
    if (
      this.state.imageDidChange &&
      this.state.grupo.imagen != null &&
      this.state.grupo.imagen != ""
    ) {
      const formData = new FormData();
      formData.append("file", this.state.grupo.imagen);
      formData.append("upload_preset", "p8vfboo9");

      axios
        .post("https://api.cloudinary.com/v1_1/tecrow/image/upload", formData)
        .then((response) => {
          this.setImgPath(response.data.url);
          console.log(this.state.grupo.imagen);
        });
    }
  }
  render() {
    return (
      <div>
        <div className="container mt-3">
          <div className="row justify-content-start">
            <div className="col-1">
              <Link to="/grupos">
                <FontAwesomeIcon
                  className="homeLink"
                  icon={faArrowCircleLeft}
                  size="2x"
                />
              </Link>
            </div>
            <div className="col-9 text-start">
              <h3>Detalles del grupo</h3>
            </div>
            <div class="col">{this.eliminarGrupo()}</div>
          </div>

          <hr
            style={{
              color: "#000000",
              backgroundColor: "#000000",
              height: 0.5,
              borderColor: "#000000",
              border: 3,
            }}
          />
          <Row
            className="justify-content-center"
            style={{ marginBottom: "18px" }}
          >
            <Col xs="6">
              <ImageLoader
                imagen={this.state.grupo.imagen}
                setImgPath={(path) => this.setImgPath(path)}
              />
            </Col>
          </Row>
          <ListGroup style={{ marginBottom: "18px" }}>
            <ListGroupItem>
              <div class="row">
                <div class="col" align="left">
                  <label class="labels">Nombre</label>
                </div>
                <Col>
                  <TextField
                    value={this.state.grupo.nombre}
                    onChange={this.cambioNombre}
                    fullWidth="true"
                    id="nombreGrupo"
                  />
                </Col>
              </div>
            </ListGroupItem>
            <ListGroupItem>
              <div class="row">
                <div class="col" align="left">
                  <label class="labels">Código</label>
                </div>
                <div class="col">
                  <TextField
                    value={this.state.grupo.codigo}
                    fullWidth="true"
                    readOnly="true"
                    id="codigoGrupo"
                  />
                </div>
              </div>
            </ListGroupItem>
            {this.state.esProfesor ? (
              <>
                <ListGroupItem>
                  <div class="row">
                    <div class="col" align="left">
                      <label class="form-check-label">Grupo activo</label>
                    </div>
                    <div class="col" align="left">
                      <Input
                        checked={this.state.grupo.estado}
                        onChange={this.cambioActivo}
                        disabled={!this.state.esProfesor}
                        class="form-check-input"
                        type="checkbox"
                        id="gridCheck"
                      />
                    </div>
                  </div>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col align="left">
                      <Label>Fecha de creación</Label>
                    </Col>
                    <Col>
                      <Input
                        type="date"
                        value={String(
                          this.state.grupo.fecha_creacion
                        ).substring(0, 10)}
                      ></Input>
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col align="left">
                      <Label>Última modificación</Label>
                    </Col>
                    <Col>
                      <Input
                        type="date"
                        readOnly="true"
                        value={String(
                          this.state.grupo.fecha_ultima_modificacion
                        ).substring(0, 10)}
                      ></Input>
                    </Col>
                  </Row>
                </ListGroupItem>
              </>
            ) : (
              <></>
            )}
          </ListGroup>
          <Col>
            <div class="row" align="left">
              <h3 class="subTitle">Miembros del grupo</h3>
            </div>
            <div class="row">
              <ul style={{ "list-style-type": "none" }}>
                {this.state.grupo.estudiantes.map((miembro) => (
                  <Row>
                    <Col />
                    <Col xs="9">
                      <li style={{ marginBottom: "7px" }}>
                        <TextField
                          align="left"
                          value={miembro}
                          fullWidth="true"
                        />
                      </li>
                    </Col>
                    <Col xs="2">
                      {this.state.esProfesor ? (
                        <Button
                          onClick={this.eliminar(miembro)}
                          color="danger"
                          size="sm"
                        >
                          <FontAwesomeIcon icon={faBan} /> Quitar
                        </Button>
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Row>
                ))}
                {this.state.esProfesor ? (
                  <Row>
                    <Col />
                    <Col xs="9">
                      <li style={{ marginBottom: "7px" }}>
                        <Tippy content="Ingrese el correo de un estudiante para añadirlo.">
                          <TextField
                            onChange={this.cambioMiembroParaAnadir}
                            value={this.state.miembroParaAnadir}
                            fullWidth="true"
                            align="left"
                            id="entradaMiembro"
                          />
                        </Tippy>
                      </li>
                    </Col>
                    <Col xs="2">
                      <Button
                        className="btn btn-primary btn-lg"
                        size="sm"
                        color="success"
                        onClick={this.agregarMiembro}
                      >
                        <FontAwesomeIcon icon={faPlusCircle} /> Agregar
                      </Button>
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
              </ul>
            </div>
          </Col>

          <Col align="left">
            <div class="row" align="left">
              <h3 class="subTitle">Juegos</h3>
            </div>
            <div class="row">
              <ul style={{ "list-style-type": "none" }}>
                {this.state.grupo.juegos.map((juego) => (
                  <Row>
                    <Col xs="1" />
                    <Col xs="9">
                      <li style={{ marginBottom: "7px" }}>
                        <TextField
                          value={juego}
                          fullWidth="true"
                          readOnly="true"
                        />
                      </li>
                    </Col>
                    <Col xs="2" />
                  </Row>
                ))}
              </ul>
            </div>
          </Col>
          {this.state.esProfesor ? (
            <Row className="justify-content-center">
              <Col xs="3">
                <Button color="info" onClick={this.save}>
                  Guardar cambios
                </Button>
              </Col>
            </Row>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
}

export default VerGrupo;
