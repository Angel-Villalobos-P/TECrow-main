import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import fire from "./fire.js";

import Grupos from "./Paginas/Profesor/Grupo/Grupos";
import Juego from "./Paginas/Profesor/Juego/Juego";
import CrearGrupo from "./Paginas/Profesor/Grupo/CrearGrupo";
import CrearJuego from "./Paginas/Profesor/Juego/CrearJuego";
import VerTrivia from "./Paginas/Profesor/Trivia/VerTrivia";
import VerJuego from "./Paginas/Profesor/Juego/VerJuego";
import Trivias from "./Paginas/Profesor/Trivia/Trivias";
import CrearTrivia from "./Paginas/Profesor/Trivia/CrearTrivia";
import Pregunta from "./Paginas/Profesor/Trivia/Pregunta";
import VerPregunta from "./Paginas/Profesor/Trivia/VerPregunta";
import VerSugerencia from "./Paginas/Profesor/Trivia/VerSugerencia";

import Header from "./Paginas/General/Header";
import VerGrupo from "./Paginas/General/VerGrupo/VerGrupo";
import Dashboard from "./Paginas/General/Dashboard";
import Perfil from "./Paginas/General/Perfil/Perfil";
import Principal from "./Paginas/General/Principal/Principal";
import LogIn from "./Paginas/General/LogIn/LogIn";
import Registro from "./Paginas/General/Registro/Registro";

import Partida from "./Paginas/Estudiante/Partida";
import UnionGrupo from "./Paginas/Estudiante/UnionGrupo";
import SalaJuego from "./Paginas/Estudiante/Juego/SalaJuego";
import JuegosE from "./Paginas/Estudiante/Juego/Juegos";
import CrearSugerencia from "./Paginas/Estudiante/Juego/CrearSugerencia";
import ReporteEstudiante from "./Paginas/Estudiante/Reporte/ReporteEstudiante";
import ReporteProfesor from "./Paginas/Profesor/Reporte/ReporteProfesor";

function App() {
  /*const [isLoggedIn, setIsLoggedIn] = useState(false);

  fire.auth().onAuthStateChanged((user) => {
    //alert("Estado de auth ha cambiado");
    return user ? setIsLoggedIn(true) : setIsLoggedIn(false);
  })
  */

  //console.log(isLoggedIn);
  return (
    <>
      <Router>
        <Header></Header>
        <Switch>
          <Route exact path="/" component={LogIn} />
          <Route path="/logIn" component={LogIn} />
          <Route path="/Registro" component={Registro} />
          <Route path="/principal" component={Principal} />
          <Route path="/VerGrupo/:id" component={VerGrupo} />
          <Route path="/Registro" component={Registro} />
          <Route path="/Grupos" component={Grupos} />
          <Route path="/Juego" component={Juego} />
          <Route path="/Trivias" component={Trivias} />
          <Route path="/CrearTrivia" component={CrearTrivia} />
          <Route path="/CrearGrupo" component={CrearGrupo} />
          <Route path="/Dashboard" component={Dashboard} />
          <Route path="/VerTrivia/:id" component={VerTrivia} />
          <Route path="/CrearJuego" component={CrearJuego} />
          <Route path="/VerJuego/:id" component={VerJuego} />
          <Route path="/Pregunta/:id" component={Pregunta} />
          <Route path="/Perfil" component={Perfil} />
          <Route path="/UnionGrupo" component={UnionGrupo} />
          <Route path="/VerPregunta/:id" component={VerPregunta} />
          <Route path="/VerSugerencia/:id" component={VerSugerencia} />
          <Route path="/SalaJuego" component={SalaJuego} />
          <Route path="/Partida" component={Partida} />
          <Route path="/JuegosE" component={JuegosE} />
          <Route path="/CrearSugerencia" component={CrearSugerencia} />
          <Route path="/ReporteEstudiante" component={ReporteEstudiante} />
          <Route path="/ReporteProfesor" component={ReporteProfesor} />
        </Switch>
      </Router>
    </>
  );
}
export default App;
