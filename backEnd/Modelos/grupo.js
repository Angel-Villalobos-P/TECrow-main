const mongoose = require("mongoose");

// Schema
const Grupo = mongoose.Schema({
  id_profesor: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  codigo: {
    type: String,
    required: false,
  },
  estado: {
    type: Boolean,
    required: true,
  },
  fecha_creacion: {
    type: Date,
    required: true,
  },
  fecha_ultima_modificacion: {
    type: Date,
    required: true,
  },
  estudiantes: {
    type: [],
    of: String,
    required: false,
  },
  juegos: {
    type: [],
    of: String,
    required: false,
  },
  imagen: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("grupos", Grupo);
