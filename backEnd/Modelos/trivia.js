const mongoose = require("mongoose");

// Schema
const Trivia = mongoose.Schema({
  id_profesor: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: false,
  },
  fecha_creacion: {
    type: Date,
    required: true,
  },
  fecha_modificacion: {
    type: Date,
    required: true,
  },
  imagen: {
    type: String,
    required: false,
  },
  material_apoyo: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("trivias", Trivia);
