import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { Spinner } from 'reactstrap';

import axios from 'axios';

import ImageLoader from "../../../Componentes/imageLoader/imageLoader";
import ImagenPorDefecto from "../../../assets/defaultPerfil.png";

import { Button, ButtonGroup, Form, FormGroup, Label, Input, Container, Col, Row } from 'reactstrap';
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const crypto = require('crypto');
var imagen = "";
var imagenPerfil = "";

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

class Perfil extends Component {

    constructor(props) {
        super(props);
        this.refCarnet = React.createRef();
        this.cargarPerfil();
    }

    state = {
        nombre: null,
        apellido1: null,
        apellido2: null,
        correoElectronicoPerfil: null,
        organizacion: null,
        carnet: null,
        contrasenia: "",
        confirmarContrasenia: "",
        tipoUsuario: "",
        loading: false,
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
                    this.modificarUsuario();
                });
        } else {
            //imagen = this.state.imagenPerfil;
            this.modificarUsuario();
        }
    };

    cargarPerfil() {
        var self = this;
        axios.get('cargarPerfil').then(function (res) {
            if (res.data.success === false) {
                //alert(res.data.error);
            } else {
                imagenPerfil = res.data.imagenPerfil;
                self.setState({
                    nombre: res.data.nombre,
                    apellido1: res.data.apellido1,
                    apellido2: res.data.apellido2,
                    correoElectronicoPerfil: res.data.correoElectronico,
                    organizacion: res.data.organizacion,
                    carnet: res.data.carnet,
                    tipoUsuario: res.data.tipoUsuario,
                    loading: true
                })
                this.setTipoUsuario();
            }
        }).catch(function (error) {
            console.log(error)
            //alert(error)
        });

    };


    modificarUsuario() {
        if (this.state.nombre == null | this.state.apellido1 == null | this.state.apellido2 == "" |
            this.state.organizacion == null) {
            alert("Por favor ingrese todos los datos solicitados");
        }
        else if (this.state.contrasenia !== "" & this.state.contrasenia.length < 6) {
            alert("La contraseña debe contener al menos 6 caracteres");
        } else if ((this.state.contrasenia !== this.state.confirmarContrasenia)) {
            // Revisa si los passwords coinciden, si no, envía una alerta
            alert("Las contraseñas no coinciden, por favor verifique las contraseñas e intentelo de nuevo")
        }
        else {
            let salt = generadorSemilla(20);
            var self = this;
            axios.patch("/actualizarUsuario", {
                nombre: this.state.nombre,
                apellido1: this.state.apellido1,
                apellido2: this.state.apellido2,
                organizacion: this.state.organizacion,
                salt: salt,
                contrasenia: hashContrasenia(salt + this.state.contrasenia),
                contrasenia: this.state.contrasenia,
                imagenPerfil: imagen,
                cambioContrasena: (this.state.contrasenia !== "") ? true : false
            })
                .then(function (res) {
                    if (!res.data.success) alert(res.data.error);
                    else {
                        alert(res.data.message);
                        window.location.href = "/dashboard";
                    }
                });
        }
    };

    //Función que se envia al Componente ImageLoader (Devuelve el path de la imagen que fue seleccionada)
    setImgPath(path) {
        imagenPerfil = path;
    }


    onChange = (e) => this.setState({
        [e.target.name]:
            e.target.value
    });

    setTipoUsuario(tipo) {
        this.state.tipoUsuario = tipo;
        if (this.state.tipoUsuario === "Profesor") {
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
                            <Link className="link" to="/dashboard" style={{ marginRight: "1em" }}>
                                <FontAwesomeIcon
                                    className="homeLink"
                                    icon={faArrowCircleLeft}
                                    size="2x"
                                />
                            </Link>
                            <Col xs="6" className="text-start">
                                <h3>Perfil de usuario</h3>
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
                                    <Col xs="6" style={{ marginBottom: "1em" }}>
                                        <FormGroup>
                                            <ImageLoader
                                                imagen={imagenPerfil}
                                                setImgPath={(path) => this.setImgPath(path)} />

                                        </FormGroup>

                                    </Col>
                                    <Label for="tipoUsuario" className="titulo"> Tipo de usuario: {this.state.tipoUsuario} </Label>

                                </Row>
                                <br />

                                <FormGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="nombre" className="titulo"> Nombre </Label>
                                    <Input name="nombre" placeholder="Ingrese su nombre" className="input" onChange={this.onChange} defaultValue={this.state.nombre} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="apellido1" className="titulo"> Primer apellido </Label>
                                    <Input name="apellido1" placeholder="Ingrese su primer apellido" className="input" onChange={this.onChange} defaultValue={this.state.apellido1} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="apellido2" className="titulo"> Segundo apellido </Label>
                                    <Input name="apellido2" placeholder="Ingrese su segundo apellido" className="input" onChange={this.onChange} defaultValue={this.state.apellido2} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="organizacion" className="titulo"> Nombre de la organización o universidad </Label>
                                    <Input name="organizacion" placeholder="Ingrese una organización o univesidad" className="input" onChange={this.onChange} defaultValue={this.state.organizacion} />
                                </FormGroup>
                                {this.state.tipoUsuario === "Estudiante" &&
                                    <FormGroup >
                                        <Label for="carnet" className="titulo"> Carnet </Label>
                                        <Input disabled name="carnet" placeholder="Ingrese su carnet estudiantil" className="input" onChange={this.onChange} defaultValue={this.state.carnet} />
                                    </FormGroup>
                                }
                                <FormGroup>
                                    <Label for="correoElectronico" className="titulo"> Correo electrónico</Label>
                                    <Input disabled name="correoElectronico" placeholder="Ingrese su correo electrónico" className="input" onChange={this.onChange} defaultValue={this.state.correoElectronicoPerfil} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="contrasenia" className="titulo"> Contraseña (Si no desea cambiar la contraseña, por favor deje estos dos espacios en blanco) </Label>
                                    <Input type="password" name="contrasenia" placeholder="Ingrese su contraseña" className="input" onChange={this.onChange} defaultValue="" />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="confirmarContrasenia" className="titulo"> Confirmación de contraseña </Label>
                                    <Input type="password" name="confirmarContrasenia" placeholder="Ingrese nuevamente la contraseña" className="input" onChange={this.onChange} defaultValue="" />
                                </FormGroup>


                            </Form>
                            <Container className="btn">
                                <Link to={"/dashboard"}>
                                    <Button id="btnCancelar"> Cancelar </Button>
                                </Link>
                                <Button id="btnRegistrar" onClick={this.subirImagen}>
                                    Modificar perfil
                                </Button>

                            </Container>
                        </>
                    )}
                </Container>
            </>
        );
    }
}

export default Perfil;
