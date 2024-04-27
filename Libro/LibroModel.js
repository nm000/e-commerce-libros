const mongoose = require("mongoose");

const LibroSchema = new mongoose.Schema({
    name: {type: String, required: true},
    propietario: {type: Number, required: true},
    genero: {type: String, required: true},
    fechaPublicacion: {type: Date, required: true},
    casaEditorial: {type: String, required: true},
    autor: {type: String, required: true},
    doi: {type: String, required: true},
    isDisponible: {type: Boolean, required: true},
    numeroUnidades: {type: Number, required: true},
    isActive: {type: Boolean, required: true}
})

const Model = mongoose.model('Libro', LibroSchema);

module.exports = Model;