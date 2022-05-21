const mongoose = require("mongoose");

// Schema
const Usuario = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido1: {
    type: String,
    required: true,
  },
  apellido2: {
    type: String,
    required: true,
  },
  correoElectronico: {
    type: String,
    required: true,
  },
  organizacion: {
    type: String,
    required: true,
  },
  tipoUsuario: {
    type: String,
    required: true,
  },
  carnet : {
    type: String,
    required: false,
  },
  contrasenia: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  imagenPerfil: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("usuarios", Usuario);
