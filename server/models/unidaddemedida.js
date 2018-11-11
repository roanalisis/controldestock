const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;



//const uniqueValidator = require('mongoose-unique-validator');
let unidaddemedidaSchema = new Schema({
    unidad: { type: String, unique: true, required: [true, 'La unidad de medida es necesaria'] },
    status: { type: Number, default: 1 },
    history: [{
        by: { type: ObjectId, required: false },
        date: { type: Date, required: false },
        action: { type: String, required: false },
        code: { type: String, required: false }
    }]
});

//unidaddemedidaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único...' });


//module.exports = mongoose.model('unidadesDeMedidas', unidaddemedidaSchema);
exports.unidadesDeMedidas = mongoose.model('unidaddemedida', unidaddemedidaSchema, 'unidadesdemedidas')