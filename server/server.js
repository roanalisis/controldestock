require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//Habilitar la carpeta public
//app.use(express.static(path.resolve(__dirname, '../public')));

// parse application/json
app.use(bodyParser.json())


//Configuración global de rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datoss ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});