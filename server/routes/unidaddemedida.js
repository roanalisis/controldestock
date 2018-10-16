const express = require('express');
const Unidaddemedida = require('../models/unidaddemedida'); //Permite crear la colección en la base de datos
const controller = require('./controller');

const app = express();
console.log("test controller");
console.log(controller.nuevaunidaddemedidas);
console.log("test controller end");

app.get('/unidaddemedida', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Unidaddemedida.find({ estado: true }, 'unidad')
        .skip(desde)
        .limit(limite)
        .exec((err, unidaddemedida) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                unidaddemedida
            });


        });
});

app.post('/unidaddemedida', function(req, res) {
    let body = req.body;
    controller.nuevaunidaddemedidas(body, function(err, result) {
        if (err) {
            console.log("Error" + err);
            return res.json({ err: true, message: result.message });
        } else {
            return res.json({ err: false, message: result.message + " " + body.unidad });
        }

    });

});







module.exports = app;