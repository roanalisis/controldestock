const express = require('express');
const Unidaddemedida = require('../models/unidaddemedida');
const controller = require('./controller');
const qs = require('qs');
const _s = require('underscore.string');

const app = express();
// console.log("test controller");
// console.log(controller.nuevaunidaddemedidas);
// console.log("test controller end");


app.get('/unidaddemedida', (req, res) => {
    res.render('unidaddemedida');
});



app.get('/unidaddemedida/list', (req, res) => {
    let params = qs.parse(req.query);
    controller.unidadesdemedidas_list(params, function(err, result) {
        if (err) {
            console.log("err");
            return res.json(result);
        } else {
            return res.json(result);
        }
    });
});



app.post('/unidaddemedida', function(req, res) {
    let body = req.body;
    controller.nuevaunidaddemedidas(body, function(err, result) {
        if (err) {
            console.log("Error:: " + err);
            return res.json({ err, message: result.message });
        } else {
            return res.json({ err, message: result.message + " " + body.unidad });
        }

    });

});



app.put('/unidaddemedida', (req, res) => {

    let body = req.body;

    let uniDad = {
        _id: body._id,
        unidad: body.unidad
    };

    if (uniDad._id != null && uniDad.unidad != null) {
        controller.actualizaunidaddemedidas(uniDad, function(err, result) {
            if (err) {
                console.log("err");
                return res.json(err);
            } else {
                return res.json(result);
            }
        });
    } else {
        return res.json({ err: true, message: "El nombre de la unidad no puede estar vacio." });
    }
});


app.delete('/unidaddemedida', (req, res) => {

    let body = req.body;

    let uniDad = {
        _id: body._id
    };

    controller.eliminaunidaddemedida(uniDad, function(err, result) {
        if (err) {
            console.log("err");
            return res.json(err);
        } else {
            return res.json(result);
        }
    });

});








module.exports = app;