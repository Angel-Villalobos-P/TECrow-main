import React, { Component } from 'react'
import { Link } from "react-router-dom";

import fire from '../../../fire.js';
import axios from 'axios';
import './Registro.css'

import ImageLoader from "../../../Componentes/imageLoader/imageLoader";
import ImagenPorDefecto from "../../../assets/defaultPerfil.png";

import { Button, ButtonGroup, Form, FormGroup, Label, Input, Container, Col, Row } from 'reactstrap';
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const crypto = require('crypto');
var imagen = "";
var imagenPerfil = ImagenPorDefecto;
var tipoUsuario = "Estudiante";

// Genera una semilla para la encriptación
function generadorSemilla(longitud) {
    return crypto.randomBytes(Math.ceil(longitud / 2))
        .toString('hex')
        .slice(0, longitud);
}

// Función para generar el hash de la contraseña
function hashContrasenia(contrasenia) {
    return crypto.createHash('sha256').update(contrasenia).digest("hex");
}

class Registro extends Component {

    constructor(props) {
        super(props);
        this.refCarnet = React.createRef();
    }

    state = {
        nombre: null,
        apellido1: null,
        apellido2: null,
        correoElectronico: null,
        organizacion: null,
        carnet: null,
        contrasenia: "",
        confirmarContrasenia: "",
    }

    // Hace push de la imagen a Cloudinary
    subirImagen = (e) => {
        if (imagenPerfil !== null) {
            e.preventDefault();
            const formData = new FormData();
            formData.append("file", imagenPerfil);
            formData.append("upload_preset", "p8vfboo9");
            axios
                .post("https://api.cloudinary.com/v1_1/tecrow/image/upload", formData)
                .then((response) => {
                    imagen = response.data.url;
                    console.log(response);
                    this.registrarUsuario();
                });
        } else {
            this.registrarUsuario();
        }
    };

    registrarUsuario() {
        if (this.state.nombre == null | this.state.apellido1 == null | this.state.apellido2 == "" |
            this.state.correoElectronico == null | this.state.organizacion == null |
            this.state.contrasenia == "" | this.state.confirmarContrasenia == "" | tipoUsuario == "") {
            alert("Por favor ingrese todos los datos solicitados");
        } else if (tipoUsuario === "Estudiante" && this.state.carnet == null) {
            alert("Favor ingrese el dato del carnet estudiantil");
        } else if (this.state.contrasenia.length < 6) {
            alert("La contraseña debe contener al menos 6 caracteres");
        } else if ((this.state.contrasenia !== this.state.confirmarContrasenia)) {
            // Revisa si los passwords coinciden, si no, envía una alerta
            alert("Las contraseñas no coinciden, por favor verifique las contraseñas e intentelo de nuevo")
        }
        else {
            let salt = generadorSemilla(20);
            var self = this;
            axios.post('registrarUsuario', {
                nombre: this.state.nombre,
                apellido1: this.state.apellido1,
                apellido2: this.state.apellido2,
                correoElectronico: this.state.correoElectronico,
                organizacion: this.state.organizacion,
                salt: salt,
                contrasenia: hashContrasenia(salt + this.state.contrasenia),
                tipoUsuario: tipoUsuario,
                carnet: this.state.carnet,
                imagenPerfil: imagen
            }
            ).then(function (response) {
                if (response.data.success === false) {
                    console.log(response);
                    alert(response.data.error);
                } else {
                    fire.auth().createUserWithEmailAndPassword(self.state.correoElectronico, self.state.contrasenia).then((newUser) => {
                        alert("Se ha registro su usuario correctamente en el sistema");
                        fire.auth().signOut()
                        window.location.href = "/logIn";
                    }).catch((error) => {
                        alert("Problema al registrar el usuario: " + error);
                    });
                }
            }).catch(function (error) {
                console.log(error)
                alert(error)
            });
        }
    };

    //Función que se envia al Componente ImageLoader (Devuelve el path de la imagen que fue seleccionada)
    setImgPath(path) {
        imagenPerfil = path;
        //this.state.imagenPerfil = path;
    }


    onChange = (e) => this.setState({
        [e.target.name]:
            e.target.value
    });

    setTipoUsuario(tipo) {
        tipoUsuario = tipo;
        if (tipoUsuario === "Profesor") {
            this.refCarnet.current.style.display = 'none';
        }
        else {
            this.refCarnet.current.style = { display: true };
        }
    }


    render() {
        return (
            <>
                <Container className="my-5">
                    <Row>
                        <Container style={{ display: "inline-flex" }}>
                            <Link className="link" to="/principal" style={{ marginRight: "1em" }}>
                                <FontAwesomeIcon
                                    className="homeLink"
                                    icon={faArrowCircleLeft}
                                    size="2x"
                                />
                            </Link>
                            <Col xs="6" className="text-start">
                                <h3>Registrar nuevo usuario</h3>
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
                            <Col xs="6" style={{ marginBottom: "1em" }}>
                                <FormGroup>
                                    <ImageLoader setImgPath={(path) => this.setImgPath(path)} />
                                </FormGroup>
                            </Col>
                        </Row>
                        <br />
                        <FormGroup>
                            <Label ref={this.refTipoUsuarioLabel} style={{ display: "flex", "justify-content": "center" }} for="nombre" className="titulo"> Tipo de usuario </Label>
                            <div style={{ display: "flex", "justify-content": "center" }}>
                                <ButtonGroup size="lg">
                                    <Button id="btnTipoUsuario" ref={this.btnEstudiante} name="tipoUsuario" label="Estudiante" value="Estudiante" onClick={(tipo) => this.setTipoUsuario("Estudiante")}>Estudiante</Button>
                                    <Button id="btnTipoUsuario" ref={this.btnProfesor} name="tipoUsuario" label="Profesor" value="Profesor" onClick={(tipo) => this.setTipoUsuario("Profesor")}>Profesor</Button>
                                </ButtonGroup>
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <Label for="nombre" className="titulo"> Nombre </Label>
                            <Input name="nombre" placeholder="Ingrese su nombre" className="input" onChange={this.onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="apellido1" className="titulo"> Primer apellido </Label>
                            <Input name="apellido1" placeholder="Ingrese su primer apellido" className="input" onChange={this.onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="apellido2" className="titulo"> Segundo apellido </Label>
                            <Input name="apellido2" placeholder="Ingrese su segundo apellido" className="input" onChange={this.onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="organizacion" className="titulo"> Nombre de la organización o universidad </Label>
                            <Input name="organizacion" placeholder="Ingrese una organización o univesidad" className="input" onChange={this.onChange} />
                        </FormGroup>
                        <div ref={this.refCarnet} style={{ display: true }}>
                            <FormGroup >
                                <Label for="carnet" className="titulo"> Carnet </Label>
                                <Input name="carnet" placeholder="Ingrese su carnet estudiantil" className="input" onChange={this.onChange} />
                            </FormGroup>
                        </div>
                        <FormGroup>
                            <Label for="correoElectronico" className="titulo"> Correo electrónico</Label>
                            <Input name="correoElectronico" placeholder="Ingrese su correo electrónico" className="input" onChange={this.onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="contrasenia" className="titulo"> Contraseña </Label>
                            <Input type="password" name="contrasenia" placeholder="Ingrese su contraseña" className="input" onChange={this.onChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="confirmarContrasenia" className="titulo"> Confirmación de contraseña </Label>
                            <Input type="password" name="confirmarContrasenia" placeholder="Ingrese nuevamente la contraseña" className="input" onChange={this.onChange} />
                        </FormGroup>


                    </Form>
                    <Container className="btn">
                        <Link to={"/"}>
                            <Button id="btnCancelar"> Cancelar </Button>
                        </Link>
                        <Button id="btnRegistrar" onClick={this.subirImagen}>
                            Registrarse
                        </Button>
                    </Container>
                </Container>
            </>
        );
    }
}

export default Registro;
