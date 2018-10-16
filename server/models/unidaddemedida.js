const mongoose = require('mongoose')
const Schema = mongoose.Schema;


//const uniqueValidator = require('mongoose-unique-validator');




let unidaddemedidaSchema = new Schema({
    unidad: {
        type: String,
        unique: true,
        required: [true, 'La unidad de medida es necesaria']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

//unidaddemedidaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único...' });


//module.exports = mongoose.model('unidadesDeMedidas', unidaddemedidaSchema);
exports.unidadesDeMedidas = mongoose.model('unidad', unidaddemedidaSchema, 'unidadesdemedidas')