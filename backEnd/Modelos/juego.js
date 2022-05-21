const mongoose = require('mongoose');

// Schema
const Juego = mongoose.Schema({
    
    id_profesor: {
        type: String,
        required: true
    },
    estado:{
        type:Boolean,
        required:true
    },
    id_trivia: {
        type: String,
        required: false
    },
    id_grupo:{
        type:String,
        required:true
    },
    nombre_grupo:{
        type:String,
        required:true
    },
    nombre:{
        type:String,
        required:true
    },
    fecha_apertura:{
        type:Date,
        required:true
    },
    fecha_cierre:{
        type:Date,
        required:true
    },
    preguntas_por_partida:{
        type:Number,
        required:false  
    },
    tiempo_por_pregunta:{
        type:Number,
        required:false  
    },
    imagen:{
        type: String,
        required: false
    }
});


module.exports = mongoose.model('juegos', Juego); 