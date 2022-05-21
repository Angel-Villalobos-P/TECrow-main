import React, { Component } from "react";
import "./Header.css";
import fire from "../../fire.js";

import axios from "axios";
import defaultPerfil from "../../assets/defaultPerfil.png";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
} from "reactstrap";

class Header extends Component {
  state = {
    sesionIniciada: false,
    esProfesor: false,
    imagenPerfil: null,
    isOpen: false,
  };

  constructor(props) {
    super(props);
    var self = this;
    fire.auth().onAuthStateChanged((usuario) => {
      usuario
        ? this.setState({ sesionIniciada: true })
        : this.setState({ sesionIniciada: false });
      axios.get("/obtenerInformacionHeader").then(function (res) {
        self.setState({
          esProfesor: res.data.tipoUsuario === "Profesor" ? true : false,
          imagenPerfil: res.data.imagenPerfil,
          render: true,
        });
      });
    });
  }

  cerrarSesion() {
    fire.auth().signOut();
    window.location.href = "/logIn";
  }

  toggle = (e) =>
    this.setState({
      isOpen: true,
    });

  render() {
    var sesion = this.state.sesionIniciada;
    var esProfesor = this.state.esProfesor;
    const colorHeader = this.state.esProfesor
      ? { background: "#006c7e" }
      : { background: "#002a59" };
    return (
      <div>
        <Navbar style={colorHeader} light expand="md">
          <Container fluid="md">
            {/* <img width="3%" height="3%" src={logo} /> */}
            <NavbarBrand
              id="NavLink"
              href={sesion ? "/dashboard" : "/principal"}
            >
              TECrow
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />

            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="mr-auto navbar-nav" navbar>
                {!sesion && (
                  <NavItem>
                    <NavLink id="NavLink" href="/registro">
                      Registro de usuario
                    </NavLink>
                  </NavItem>
                )}
                {!sesion && (
                  <NavItem>
                    <NavLink id="NavLink" href="/logIn">
                      Iniciar Sesión
                    </NavLink>
                  </NavItem>
                )}
                {sesion && esProfesor && (
                  <NavItem>
                    <NavLink id="NavLink" href="/grupos">
                      Grupos
                    </NavLink>
                  </NavItem>
                )}
                {sesion && esProfesor && (
                  <NavItem>
                    <NavLink id="NavLink" href="/trivias">
                      Trivias
                    </NavLink>
                  </NavItem>
                )}
                {sesion && esProfesor && (
                  <NavItem>
                    <NavLink id="NavLink" href="/juego">
                      Juegos
                    </NavLink>
                  </NavItem>
                )}
                {sesion && !esProfesor && (
                  <NavItem>
                    <NavLink id="NavLink" href="/UnionGrupo">
                      Incorporarse a un grupo
                    </NavLink>
                  </NavItem>
                )}
                {sesion && (
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret id="NavLink">
                      Perfil
                    </DropdownToggle>

                    <DropdownMenu left>
                      <DropdownItem>
                        <NavLink href="/Perfil">Ver perfil</NavLink>
                      </DropdownItem>
                      <DropdownItem>
                        <NavLink href="/" onClick={() => this.cerrarSesion()}>
                          Cerrar sesión
                        </NavLink>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                )}
              </Nav>

              {sesion && (
                <div style={{ marginRight: "1rem" }}>
                  <img
                    className="imagenCircular"
                    src={
                      this.state.imagenPerfil !== null
                        ? this.state.imagenPerfil
                        : defaultPerfil
                    }
                  />
                </div>
              )}
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default Header;
