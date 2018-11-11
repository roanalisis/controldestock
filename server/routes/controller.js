const dao = require('../dao/dao'); //Permite crear la colección en la base de datos
const db = require('../models/unidaddemedida'); //Permite crear la colección en la base de datos
const _s = require('underscore.string');
const _ = require('lodash')
moment = require('moment');


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

exports.unidadesdemedidas_list = function(params, cb) {
    let data = {
        //regex pagination queries
        query: {
            sortdatafield: _s.escapeHTML(params.sortdatafield).trim(),
            sortorder: _s.escapeHTML(params.sortorder).trim(),
            name_startsWith: _s.escapeHTML(params.name_startsWith).trim(),
            recordstartindex: parseInt(_s.escapeHTML(params.recordstartindex).trim()),
            pagesize: parseInt(_s.escapeHTML(params.pagesize).trim()),
        },
        //Model
        model: db.unidadesDeMedidas,

        //Poperty Array required for filtering
        properties: [
            { search: 'or', search_type: 'regex', field: 'unidad' },
            { search: 'and', search_type: 'other', field: 'status', query: 1 }
        ],
        //Custom paging for pre-lookups & pre-projects, make sure to determine sort, limit and skip
        custom_paging: {},
        //Custom aggregate for final lookups & projects 
        custom_aggregate: {
            $project: {
                _id: 1,
                unidad: 1,
                estado: 1,
            },
        },
    };

    data.search = dao.filter(data);
    dao.count(data, function(err, count) {
        if (err) {
            console.log("Count Error: " + err);
            return cb(true, null);
        } else {
            dao.aggregate(data, function(err, Schema) {
                if (err) {
                    console.log("Aggregate Error: " + err)
                    return cb(true, null);
                } else {
                    let result = {
                        TotalRows: count,
                        Rows: Schema
                    }
                    return cb(false, result);
                }
            });
        }
    });
}



exports.actualizaunidaddemedidas = function(params, cb) {
    let data = {
        model: db.unidadesDeMedidas,
        audit: {
            is_audit: false
        },
        filter: { _id: params._id },
        update: {
            $set: {
                unidad: params.unidad
            },
            $push: {
                history: {
                    by: null,
                    date: moment().toDate(),
                    action: 'Update',
                    code: '2'
                }
            }
        }
    };

    dao.update(data, function(err, Schema) {
        if (err) {
            console.log(err);
            return cb(true, null);
        } else {
            return cb(false, params);
        }
    });
};




exports.eliminaunidaddemedida = function(params, cb) {
    let data = {
        model: db.unidadesDeMedidas,
        audit: {
            is_audit: false
        },
        user: {
            _id: null
        },
        filter: { _id: params._id },
    };

    dao.delete(data, function(err, Schema) {
        if (err) {
            console.log(err);
            return cb(true, null);
        } else {
            return cb(false, Schema);
        }
    });
};