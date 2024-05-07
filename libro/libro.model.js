const mongoose = require("mongoose");

const schemaLibro = new mongoose.Schema({
    name: {type: String, required: true},
    owner: {type: String, required: true},
    gender: {type: String, required: true},
    publicationDate: {type: Date, required: true},
    publishingHouse: {type: String, required: true},
    author: {type: String, required: true},
    price: {type: Number, requited: true},
    numberOfUnits: {type: Number, required: true},
    isAvailable: {type: Boolean, required: true},
    isActive: {type: Boolean, required: true}
},{
    timestamps: true,
    versionKey: false
})

const Model = mongoose.model('Libro', schemaLibro);

module.exports = Model;