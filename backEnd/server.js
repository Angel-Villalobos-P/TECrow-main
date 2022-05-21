const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const app = express();
const crypto = require("crypto");

require("./database.js"); //Conexión a la base de datos de MongoDB
const Usuario = require("./Modelos/usuario"); //Modelo de usuario
const Grupo = require("./Modelos/grupo"); //Modelo de grupo
const Trivia = require("./Modelos/trivia"); //Modelo de trivia
const Juego = require("./Modelos/juego"); //Modelo de juego
const Pregunta = require("./Modelos/pregunta"); //Modelo de pregunta
const Opcion = require("./Modelos/opcion"); //Modelo de opcion
const Respuesta = require("./Modelos/respuestas_por_juego"); //Modelo de respuestas por juego

/*--------------------------- USAR MIENTRAS ESTAMOS EN DESARROLLO--------------------------------*/
const API_PORT = 3001;
app.listen(3001, () => {
  console.log(`Servidor corriendo en el puerto ${API_PORT}`);
});
/*------------------------------------------------------------------------------------------------*/

/*----------------------------USAR PARA SUBIR LA PAGINA A HEROKU----------------------------------*/
/*const path = require("path");  //VERIFICAR
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
app.use(express.static(path.resolve(__dirname, "../frontEnd/build")))
app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, "../frontEnd/build","index.html"));
})
*/
/*------------------------------------------------------------------------------------------------*/

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

////////////////////////////////////////
////   Funciones frontEnd/MongoDB  ////
//////////////////////////////////////

////////////////////////////////////////
////   Manejo de sesiones          ////
//////////////////////////////////////

app.use(
  session({
    secret: "secret word",
    resave: false,
    saveUninitialized: false,
  })
);

//Creador Hash para le encriptación de la contrasenia
function hashContrasenia(contrasenia) {
  return crypto.createHash("sha256").update(contrasenia).digest("hex");
}

// iniciarSesion -> Llamado desde frontEnd/src/Paginas/LogIn/LogIn.js
app.post("/iniciarSesion", (req, res) => {
  var pUsuario = req.body.pUsuario;
  var pContrasenia = req.body.pContrasenia;
  //console.log("El usuario a buscar es: " + pUsuario);
  if (pUsuario && pContrasenia) {
    Usuario.findOne({ correoElectronico: pUsuario }, function (err, usuario) {
      if (usuario == null) {
        Usuario.findOne({ carnet: pUsuario }, function (err, usuario) {
          if (usuario == null) {
            return res.json({
              success: false,
              error: "El nombre de usuario no está registrado en el sistema",
            });
          } else {
            let salt = usuario.salt;
            if (hashContrasenia(salt + pContrasenia) != usuario.contrasenia) {
              return res.json({
                success: false,
                error: "Nombre de usuario y/o contraseña incorrectos",
              });
            }
            req.session.sesionIniciada = true;
            req.session._id = usuario._id;
            req.session.correoElectronico = usuario.correoElectronico;
            req.session.imagenPerfil = usuario.imagenPerfil;
            req.session.tipoUsuario = usuario.tipoUsuario;
            return res.json({
              success: true,
              usuario: usuario.correoElectronico,
            });
          }
        });
      } else {
        let salt = usuario.salt;
        if (hashContrasenia(salt + pContrasenia) !== usuario.contrasenia) {
          return res.json({
            success: false,
            error: "Nombre de usuario y/o contraseña incorrectos",
          });
        }
        req.session.sesionIniciada = true;
        req.session._id = usuario._id;
        req.session.correoElectronico = usuario.correoElectronico;
        req.session.imagenPerfil = usuario.imagenPerfil;
        req.session.tipoUsuario = usuario.tipoUsuario;
        return res.json({ success: true, usuario: usuario.correoElectronico });
      }
    });
  } else {
    return res.json({
      success: false,
      error: "Por favor ingrese el nombre de usuario y la contraseña",
    });
  }
});

// obtenerInformacionHEader -> Llamado desde frontEnd/src/Paginas/Header.js
app.get("/obtenerInformacionHeader", (req, res) => {
  res.send(req.session);
  res.end();
});

////////////////////////////////////////
////   Manejo de usuarios          ////
//////////////////////////////////////

// cargarPerfil -> frontEnd/src/Paginas/Perfil/Perfil.js
app.get("/cargarPerfil", (req, res) => {
  Usuario.findOne(
    { correoElectronico: req.session.correoElectronico },
    (err, usuario) => {
      if (err) {
        console.log(err);
        res.send({ Error: err });
      } else {
        var carnetAux =
          usuario.tipoUsuario === "Estudiante" ? usuario.carnet : "";
        res.send({
          tipoUsuario: usuario.tipoUsuario,
          nombre: usuario.nombre,
          apellido1: usuario.apellido1,
          apellido2: usuario.apellido2,
          correoElectronico: usuario.correoElectronico,
          organizacion: usuario.organizacion,
          carnet: carnetAux,
          imagenPerfil: usuario.imagenPerfil,
        });
      }
      res.end();
    }
  );
});

app.patch("/actualizarUsuario", function (req, res) {
  if (false /*req.body.cambioContrasena*/) {
    Usuario.updateOne(
      { correoElectronico: req.session.correoElectronico },
      {
        nombre: req.body.nombre,
        apellido1: req.body.apellido1,
        apellido2: req.body.apellido2,
        organizacion: req.body.organizacion,
        imagenPerfil: req.body.imagenPerfil,
        contrasenia: req.body.contrasenia,
      },
      function (err, updated) {
        if (err) {
          console.log("Error" + err);
          res.json({
            success: false,
            error: err + "Ha ocurrido un problema al modificar los datos.",
          });
        } else {
          res.json({
            success: true,
            message: "Usuario actualizado correctamente",
          });
        }
      }
    );
  } else {
    Usuario.updateOne(
      { correoElectronico: req.session.correoElectronico },
      {
        nombre: req.body.nombre,
        apellido1: req.body.apellido1,
        apellido2: req.body.apellido2,
        organizacion: req.body.organizacion,
        imagenPerfil: req.body.imagenPerfil,
      },
      function (err, updated) {
        if (err) {
          console.log("Error" + err);
          res.json({
            success: false,
            error: err + "Ha ocurrido un problema al modificar los datos.",
          });
        } else {
          res.json({
            success: true,
            message: "Usuario actualizado correctamente",
          });
        }
      }
    );
  }
});

// registrarUsuario -> frontEnd/src/Paginas/Registro/Registro.js
app.post("/registrarUsuario", (req, res) => {
  let usuarioNuevo = new Usuario(); // crear el esquema de usuario
  const {
    nombre,
    apellido1,
    apellido2,
    correoElectronico,
    organizacion,
    tipoUsuario,
    contrasenia,
    salt,
    imagenPerfil,
    carnet,
  } = req.body;
  Usuario.findOne(
    { correoElectronico: correoElectronico },
    function (err, usuario) {
      if (usuario == null) {
        usuarioNuevo.nombre = nombre;
        usuarioNuevo.apellido1 = apellido1;
        usuarioNuevo.apellido2 = apellido2;
        usuarioNuevo.correoElectronico = correoElectronico;
        usuarioNuevo.organizacion = organizacion;
        usuarioNuevo.tipoUsuario = tipoUsuario;
        usuarioNuevo.salt = salt;
        usuarioNuevo.contrasenia = contrasenia;
        usuarioNuevo.imagenPerfil = imagenPerfil;
        usuarioNuevo.carnet = carnet;
        usuarioNuevo.save((err) => {
          // Guardar el nuevo usuario
          if (err) {
            return res.json({ success: false, error: err });
          }
          return res.json({ success: true });
        });
      } else
        return res.json({
          success: false,
          error:
            "Este correo electrónico ya se encuentra actualmente registrado en el sistema, por favor ingrese un nuevo correo",
        });
    }
  );
});
app.get("/estudianteParaAniadirAGrupo/:carnet", (req, res) => {
  // valida que un estudiante exista
  res.send({
    sePuedeAniadir: Usuario.exists({ carnet: req.params.carnet }),
  });
  res.end();
});

////////////////////////////////////////
////   Manejo de grupos            ////
//////////////////////////////////////

app.post("/extraerTotalGrupos", function (req, res) {
  Grupo.find({}, function (err, grupos) {
    if (err) return console.log(err);
    var gruposMap = [];
    grupos.forEach(function (grupo, index) {
      gruposMap.push(grupo);
    });
    res.send(gruposMap);
    res.end();
  });
});

app.post("/extraerGrupos", function (req, res) {
  var pIdUsuario = req.session.correoElectronico;
  if (req.session.tipoUsuario == "Profesor") {
    Grupo.find({}, function (err, grupos) {
      if (err) return console.log(err);
      var gruposMap = [];
      grupos.forEach(function (grupo, index) {
        if (grupo.id_profesor === pIdUsuario) {
          gruposMap.push(grupo);
        }
      });
      res.send(gruposMap);
      res.end();
    });
  } else if (!!pIdUsuario) {
    Usuario.findOne({ correoElectronico: pIdUsuario }, (err, usu) => {
      if (!!err || !usu) res.send({ error: true });
      else
        Grupo.find({ estudiantes: usu.carnet }, (err, grupos) => {
          res.send(grupos);
          res.end();
        });
    });
  }
});

app.patch("/grupo/:id", (req, res) => {
  //actualiza la información de un grupo.
  Grupo.updateOne({ _id: req.params.id }, req.body.grupo).then(
    (err, updated) => {
      if (err) res.send({ error: err });
      else res.send({ exito: true });
      res.end();
    }
  );
});
app.get("/grupo/:id", (req, res) => {
  //se obtiene la información de grupo apartir del id
  Grupo.findById(req.params.id, (err, grupo) => {
    if (err) {
      console.log(err);
      res.send({ Error: err });
    } else {
      res.send({ grupo });
    }
    res.end();
  });
});
app.get("/verGrupoParaIncorporarse/:codigo", (req, res) => {
  Grupo.findOne(
    { codigo: req.params.codigo },
    { _id: true, nombre: true, imagen: true }
  ).then((grupo) => {
    res.send({ grupo: grupo });
  });
});
app.post("/incorporarse/:idGrupo", async (req, res) => {
  var grupo = await Grupo.findOne({ _id: req.params.idGrupo });
  Usuario.findOne(
    { correoElectronico: req.session.correoElectronico },
    { carnet: true },
    (err, usuario) => {
      if (!grupo.estudiantes.includes(usuario.carnet)) {
        grupo.estudiantes.push(usuario.carnet);
        Grupo.findByIdAndUpdate(req.params.idGrupo, grupo, (err) => {
          res.send({ exito: !!!err });
        });
      } else {
        res.send({ exito: false });
      }
    }
  );
});
app.delete("/grupo/:id", (req, res) => {
  Grupo.deleteOne({ _id: req.params.id }).then((err) =>
    res.send({ exito: !err, err: err })
  );
}); //fin de operaciones sobre colección de grupo
app.post("/extraerEstudiantes", function (req, res) {
  Usuario.find({}, function (err, estudiantes) {
    if (err) return console.log(err);
    var estudiantesMap = [];
    estudiantes.forEach(function (estudiante, index) {
      if (estudiante.tipoUsuario === "Estudiante") {
        estudiantesMap.push(estudiante);
      }
    });
    res.send(estudiantesMap);
    res.end();
  });
});

app.get("/extraerJuego/:id", (req, res) => {
  Juego.findById(req.params.id, (err, juego) => {
    if (err) {
      console.log(err);
      res.send({ Error: err });
    } else {
      res.send({
        id_trivia: juego.id_trivia,
        id_grupo: juego.id_grupo,
        nombre: juego.nombre,
        fecha_apertura: juego.fecha_apertura,
        fecha_cierre: juego.fecha_cierre,
        preguntas_por_partida: juego.preguntas_por_partida,
        tiempo_por_pregunta: juego.tiempo_por_pregunta,
        estado: juego.estado,
        imagen: juego.imagen,
      });
    }
    res.end();
  });
});

app.post("/crearGrupos", function (req, res) {
  var pIdUsuario = req.session.correoElectronico;
  const {
    nombre,
    codigo,
    estado,
    fechaCreacion,
    fechaUltimaModificacion,
    estudiantes,
    juegos,
    imagen,
  } = req.body;
  let grupo = new Grupo();
  grupo.id_profesor = pIdUsuario;
  grupo.nombre = nombre;
  grupo.estado = estado;
  grupo.codigo = codigo;
  grupo.imagen = imagen;
  estudiantes.forEach(function (estudiante) {
    grupo.estudiantes.push(estudiante);
  });
  juegos.forEach(function (juego) {
    grupo.juegos.push(juego);
  });
  grupo.fecha_creacion = fechaCreacion;
  grupo.fecha_ultima_modificacion = fechaUltimaModificacion;

  grupo.save((err) => {
    if (err) {
      res.json({ success: false, error: err + "Ha ocurrido un problema." });
      res.end();
    } else {
      res.json({ success: true, message: "Grupo agregado" });
    }
  });
});

app.post("/crearTrivia", function (req, res) {
  const {
    nombre,
    descripcion,
    fecha_creacion,
    fecha_modificacion,
    imagen,
    material_apoyo,
  } = req.body;
  let trivia = new Trivia();
  trivia.id_profesor = req.session.correoElectronico;
  trivia.nombre = nombre;
  trivia.descripcion = descripcion;
  trivia.fecha_creacion = new Date(fecha_creacion);
  trivia.fecha_modificacion = new Date(fecha_modificacion);
  trivia.imagen = imagen;
  trivia.material_apoyo = material_apoyo;

  trivia.save((err) => {
    if (err) {
      res.json({ success: false, error: err + "Ha ocurrido un problema." });
    } else {
      res.json({ success: true, message: "Trivia agregada" });
    }
  });
});

app.post("/crearJuegos", function (req, res) {
  var pIdUsuario = req.session.correoElectronico;
  const {
    id_trivia,
    id_grupo,
    nombre_grupo,
    nombre,
    fecha_apertura,
    fecha_cierre,
    preguntas_por_partida,
    tiempo_por_pregunta,
    estado,
    imagen,
  } = req.body;
  let juego = new Juego();
  juego.id_profesor = pIdUsuario;
  juego.nombre = nombre;
  juego.estado = estado;
  juego.imagen = imagen;
  juego.id_trivia = id_trivia;
  juego.id_grupo = id_grupo;
  juego.nombre_grupo = nombre_grupo;
  juego.fecha_apertura = fecha_apertura;
  juego.fecha_cierre = fecha_cierre;
  juego.preguntas_por_partida = preguntas_por_partida;
  juego.tiempo_por_pregunta = tiempo_por_pregunta;

  juego.save((err) => {
    if (err) {
      res.json({ success: false, error: err + "Ha ocurrido un problema." });
    } else {
      res.json({ success: true, message: "Juego agregado" });
    }
  });
});

////////////////////////////////////////
////   Manejo de trivias           ////
//////////////////////////////////////

app.delete("/eliminarTrivia/:id", (req, res) => {
  Trivia.deleteOne({ _id: req.params.id }).then((err) =>
    res.send({ exito: !err, err: err })
  );
});

app.delete("/eliminarPregunta/:id", (req, res) => {
  Pregunta.deleteOne({ _id: req.params.id }).then((err) =>
    res.send({ exito: !err, err: err })
  );
});

app.delete("/eliminarPreguntas/:id", (req, res) => {
  Pregunta.deleteMany({ id_trivia: req.params.id }).then((err) =>
    res.send({ exito: !err, err: err })
  );
});

app.post("/extraerTrivias", function (req, res) {
  var pIdUsuario = req.session.correoElectronico; //El correo viene directamente de la sesión
  Trivia.find({}, function (err, trivias) {
    if (err) return console.log(err);
    var triviasMap = [];
    trivias.forEach(function (trivia, index) {
      if (trivia.id_profesor == pIdUsuario) {
        triviasMap.push(trivia);
      }
    });
    res.send(triviasMap);
    res.end();
  });
});

app.get("/extraerTrivia/:id", function (req, res) {
  Trivia.findById(req.params.id, (err, trivia) => {
    if (err) {
      console.log(err);
      res.send({ Error: err });
    } else {
      res.send({
        id_profesor: trivia.id_profesor,
        nombre: trivia.nombre,
        descripcion: trivia.descripcion,
        fecha_creacion: trivia.fecha_creacion,
        fecha_modificacion: trivia.fecha_modificacion,
        imagen: trivia.imagen,
        material_apoyo: trivia.material_apoyo,
      });
    }
    res.end();
  });
});

app.post("/extraerPreguntas/:id", function (req, res) {
  var idTrivia = req.body.idTrivia;
  Pregunta.find({}, { "opciones._id": false }, function (err, preguntas) {
    if (err) return null;
    var preguntasMap = [];
    preguntas.forEach(function (pregunta, index) {
      if (pregunta.id_trivia === idTrivia) {
        preguntasMap.push(pregunta);
      }
    });
    res.send(preguntasMap);
    res.end();
  });
});

app.get("/extraerPregunta/:id", function (req, res) {
  Pregunta.findById(req.params.id, (err, pregunta) => {
    if (err) {
      console.log(err);
      res.send({ Error: err });
    } else {
      console.log(res);
      res.send({
        id_trivia: pregunta.id_trivia,
        enunciado: pregunta.enunciado,
        audiovisual: pregunta.audiovisual,
        esSugerencia: pregunta.esSugerencia,
        opciones: pregunta.opciones,
      });
    }
    res.end();
  });
});

app.post("/crearPregunta", function (req, res) {
  const { id_trivia, enunciado, audiovisual, esSugerencia, opciones } =
    req.body;
  let pregunta = new Pregunta();
  pregunta.id_trivia = id_trivia;
  pregunta.enunciado = enunciado;
  pregunta.audiovisual = audiovisual;
  pregunta.esSugerencia = esSugerencia;
  opciones.forEach(function (opcion) {
    var respuesta = {
      respuesta: opcion.respuesta,
      esCorrecta: opcion.esCorrecta,
    };
    pregunta.opciones.push(respuesta);
  });

  pregunta.save((err) => {
    if (err) {
      res.json({ success: false, error: err + "Ha ocurrido un problema." });
    } else {
      res.json({ success: true, message: "Pregunta agregada" });
    }
  });
});

app.patch("/actualizarPregunta/:id", function (req, res) {
  //console.log(req.body);

  Pregunta.updateOne({ _id: req.params.id }, req.body.pregunta).then(
    (err, updated) => {
      if (err) res.send({ exito: false, error: err });
      else res.send({ exito: true });
      res.end();
    }
  );
});

app.patch("/actualizarTrivia/:id", function (req, res) {
  //console.log(req.body);

  Trivia.updateOne({ _id: req.params.id }, req.body.trivia).then(
    (err, updated) => {
      if (err) res.send({ error: err });
      else res.send({ exito: true });
      res.end();
    }
  );
});

////////////////////////////////////////
////   Manejo de juegos            ////
//////////////////////////////////////
app.post("/extraerJuegos", function (req, res) {
  var pIdUsuario = req.session.correoElectronico;
  var pGrupos = req.body.pGrupos;
  //console.log(pGrupos);
  Juego.find({}, function (err, juegos) {
    if (err) return console.log(err);
    var juegosMap = [];
    juegos.forEach(function (juego, index) {
      if (juego.id_profesor === pIdUsuario) {
        juegosMap.push(juego);
      }
      if (pGrupos != []) {
        for (var i = 0; i < pGrupos.length; i++) {
          if (juego.id_grupo == pGrupos[i]._id) {
            if (!juegosMap.includes(juego)) juegosMap.push(juego);
          }
        }
      }
    });
    res.send(juegosMap);
    res.end();
  });
});

app.post("/extraerJuegosE", function (req, res) {
  var pGrupos = req.body.pGrupos;
  var juegosMap = [];
  Juego.find({}, function (err, juegos) {
    if (err) return console.log(err);
    juegos.forEach(function (juego, index) {
      for (var i = 0; i < pGrupos.length; i++) {
        if (juego.id_grupo === pGrupos[i]._id) {
          if (!juegosMap.includes(juego)) juegosMap.push(juego);
        }
      }
    });

    res.send(juegosMap);
    res.end();
  });
});

app.patch("/actualizarJuego/:id", function (req, res) {
  Juego.updateOne(
    { _id: req.params.id },
    req.body.juego,
    function (err, updated) {
      if (err) {
        console.log("Error" + err);
        res.json({ success: false, error: err + "Ha ocurrido un problema." });
      } else {
        res.json({ success: true, message: "Juego actualizado correctamente" });
      }
    }
  );
});

app.delete("/eliminarJuego/:id", function (req, res) {
  //console.log(req.params.id);
  Juego.deleteOne({ _id: req.params.id }, function (err, deleted) {
    res.send({ exito: !err, err: err });
    res.end();
  });
});

app.post("/extraerRespuestaEstudiante/:id", function (req, res) {
  var idJuego = req.params.id;
  var idTrivia = req.body.idTrivia;
  var pIdUsuario = req.session.correoElectronico;
  Respuesta.find({}, function (err, respuestas) {
    if (err) return console.log(err);
    var respuestasMap = [];
    respuestas.forEach(function (respuesta, index) {
      if (respuesta.id_juego === idJuego) {
        if (respuesta.id_usuario === pIdUsuario) {
          if (respuesta.id_trivia === idTrivia) {
            respuestasMap.push(respuesta);
          }
        }
      }
    });
    res.send(respuestasMap);
    res.end();
  });
});
//Inicio de sección del archivo con reportes del profesor
//Extraer rendimiento por estudiante por juego.
app.post("/extraerRendimientoPorEstudiante/:idJuego", (req, res) => {
  // se busca por todos los estudiantes, el mejor puntaje obtenido apartir de los intentos registrados.
  Respuesta.find(
    {
      id_juego: req.params.idJuego,
    },
    (err, respuestas) => {
      var rendimientoXEstudiante = [];
      respuestas.forEach((respuesta_juego) => {
        var mejorPuntaje = 0;
        console.log(respuesta_juego.cantidad_intentos);
        respuesta_juego.cantidad_intentos.forEach((intento) => {
          // aquí es donde se escoge únicamente el mejor intento.
          if (intento.puntaje > mejorPuntaje) mejorPuntaje = intento.puntaje;
        });
        rendimientoXEstudiante.push([respuesta_juego.id_usuario, mejorPuntaje]);
      });
      res.send({ datos: rendimientoXEstudiante });
    }
  );
  //}
});
app.get("/extraerRespuestaProfesor/:idJuego", function (req, res) {
  Respuesta.find(
    {
      id_juego: req.params.idJuego,
    },
    function (err, respuestas_juego) {
      if (err) {
        console.log(err);
        res.send({ error: err });
      } else if (!respuestas_juego.length) res.send({ vacio: true });
      else {
        var aciertosXPregunta = new Map();
        // para cada respuesta de pregunta del juego en cuestión, se acumulan los aciertos en el diccionario aciertosXPregunta
        respuestas_juego.forEach((respuesta_juego) => {
          respuesta_juego.preguntas.forEach((respuesta_pregunta) => {
            aciertosXPregunta.set(
              respuesta_pregunta.enunciado,
              (aciertosXPregunta.has(respuesta_pregunta.enunciado) //Si ya está mapeado toma el valor mapeado, sino toma 0
                ? aciertosXPregunta.get(respuesta_pregunta.enunciado)
                : 0) + respuesta_pregunta.aciertos // le suma el nuevo acierto encontrado
            ); // y lo mapea al enunciado encontrado
          });
        });
        res.send({ datos: Array.from(aciertosXPregunta.entries()) });
      }
    }
  );
}); //fin reportes profesor

app.post("/extraerRespuestas/:id", function (req, res) {
  var idJuego = req.params.id;
  var idTrivia = req.body.idTrivia;
  Respuesta.find({}, function (err, respuestas) {
    if (err) return console.log(err);
    var respuestasMap = [];
    respuestas.forEach(function (respuesta, index) {
      if (respuesta.id_juego === idJuego) {
        if (respuesta.id_trivia === idTrivia) {
          respuestasMap.push(respuesta);
        }
      }
    });
    res.send(respuestasMap);
    res.end();
  });
});

app.post("/crearRespuestaJuego", (req, res) => {
  var preguntas = req.body.preguntas;

  Respuesta.findOne({
    id_usuario: req.body.id_usuario,
    id_trivia: req.body.id_trivia,
    id_juego: req.body.id_juego,
  }).then((respuesta) => {
    if (respuesta === null) {
      let respuestas = new Respuesta();
      var intento = {
        num_partida: 0,
        puntaje: 0,
      };
      respuestas.cantidad_intentos.push(intento);
      respuestas.id_usuario = req.body.id_usuario;
      respuestas.id_juego = req.body.id_juego;
      respuestas.id_trivia = req.body.id_trivia;

      preguntas.forEach(function (pregunta) {
        var objPregunta = {
          enunciado: pregunta.enunciado,
          aciertos: 0,
          fallos: 0,
          opciones: pregunta.opciones,
          audiovisual: pregunta.audiovisual,
        };
        respuestas.preguntas.push(objPregunta);
      });
      respuestas.save((err) => {
        if (err) {
          res.json({ success: false, error: err + "Ha ocurrido un problema." });
          res.end();
        } else {
          res.json({ success: true, message: "Respuestas agregado" });
        }
      });
      return res.send(respuestas);
    } else {
      return res.send(respuesta);
    }
    //res.end();
  });
});

app.patch("/actualizarRespuestas", function (req, res) {
  console.log(req.body.id_usuario);
  console.log(req.body.id_juego);
  console.log(req.body.id_trivia);
  console.log(req.body.respuestas_juego);
  Respuesta.updateOne(
    {
      id_usuario: req.body.id_usuario,
      id_juego: req.body.id_juego,
      id_trivia: req.body.id_trivia,
    },
    req.body.respuestas_juego,
    function (err, updated) {
      if (err) {
        console.log("Error" + err);
        res.json({ success: false, error: err + "Ha ocurrido un problema." });
        res.end();
      } else {
        res.json({
          success: true,
          message: "Respuestas actualizado correctamente",
        });
      }
    }
  );
});

app.patch("/actualizarRespuestas", function (req, res) {
  console.log(req.body.id_usuario);
  console.log(req.body.id_juego);
  console.log(req.body.id_trivia);
  console.log(req.body.respuestas_juego);
  Respuesta.updateOne(
    {
      id_usuario: req.body.id_usuario,
      id_juego: req.body.id_juego,
      id_trivia: req.body.id_trivia,
    },
    req.body.respuestas_juego,
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated Docs : ", docs);
      }
    }
  );
});
