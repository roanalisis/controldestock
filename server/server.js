require('./config/config');

const express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    app = express(),
    hbs = require('hbs'),
    morgan = require('morgan');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//Habilitar la carpeta public
//app.use(express.static(path.resolve(__dirname, '../public')));

// parse application/json
app.use(bodyParser.json())



//middleware
app.use(express.static(__dirname + '/public'));


//express HBS engine
hbs.registerPartials(__dirname + '/v/parciales');
app.set('view engine', 'hbs');
console.log(__dirname + '/v/parciales');




//Configuración global de rutas
app.use(morgan('dev'));
app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datoss ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});