const dao = require('../dao/dao'); //Permite crear la colección en la base de datos
const db = require('../models/unidaddemedida'); //Permite crear la colección en la base de datos


exports.nuevaunidaddemedidas = function(params, cb) {

    let data = {
        model: db.unidadesDeMedidas,
        schema: {
            unidad: params.unidad

        }
    };
    dao.new(data, function(err, result) {
        if (err) {
            //console.log("Error: " + err);
            return cb(true, result);
        } else {
            result.message = "se ha registrado la unidad";
            return cb(false, result);

        }
    });
};