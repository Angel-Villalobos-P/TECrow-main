const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://admin:admin@cluster0.gr1ov.mongodb.net/TECrow?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("------->>> CLIENTE MONGODB CONECTADO <<<------"))
    .catch(err => console.log(err));

