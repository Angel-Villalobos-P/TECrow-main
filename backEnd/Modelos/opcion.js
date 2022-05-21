const mongoose = require('mongoose');

// Schema
const Opcion = mongoose.Schema({
    respuesta: {
        type:String,
        required:true
    },
    esCorrecta: {
        type:Boolean,
        required:true
    },
});


module.exports = mongoose.model('opciones', Opcion); 