const mongoose = require("mongoose");

// Schema
const Respuesta = mongoose.Schema({
  id_juego: {
    type: String,
    required: true,
  },
  cantidad_intentos: {
    type: [],
    of: {
      num_partida: {
        type: Number,
        required: true,
      },
      puntaje: {
        type: Number,
        required: true,
      },
    },
    require: true,
  },
  id_usuario: {
    type: String,
    required: true,
  },
  id_trivia: {
    type: String,
    required: true,
  },
  preguntas: {
    type: [],
    of: {
      enunciados: {
        type: String,
        required: true,
      },
      aciertos: {
        type: Number,
        required: true,
      },
      fallos: {
        type: Number,
        required: true,
      },
      opciones: {
        type: [],
        of: {
          respuesta: {
            type: String,
            required: true,
          },
          esCorrecta: {
            type: Boolean,
            required: true,
          },
        },
        required: true,
      },
      audiovisual: {
        type: String,
        required: false,
      },
    },
    require: true,
  },
});

module.exports = mongoose.model("respuestas_por_juegos", Respuesta);
