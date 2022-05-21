const mongoose = require('mongoose');
const Opcion = require("./opcion");

// Schema
const Pregunta = mongoose.Schema({

    id_trivia: {
        type: String,
        required: true
    },
    enunciado: {
        type: String,
        required: true
    },
    audiovisual: {
        type: String,
        required: false
    },
    esSugerencia: {
        type: Boolean,
        required: true
    },
    opciones: {
        type: [],
        of: {
            respuesta: {
                type:String,
                required:true
            },
            esCorrecta: {
                type:Boolean,
                required:true
            },
        },
        required: true
    },
});


module.exports = mongoose.model('preguntas', Pregunta);