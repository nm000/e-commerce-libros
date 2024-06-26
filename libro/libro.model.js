const mongoose = require("mongoose")

const schemaLibro = new mongoose.Schema({
    name: {type: String, required: true},
    owner: {type: String, required: true},
    gender: {type: String, required: true},
    publicationDate: {type: Date, required: true},
    publishingHouse: {type: String, required: true},
    author: {type: String, required: true},
    price: {type: Number, requited: true},
    numberOfUnits: {type: Number, default: 1},
    isAvailable: {type: Boolean, default: true},
    isActive: {type: Boolean, default: true}
},{
    timestamps: true,
    versionKey: false
})

const Model = mongoose.model('Libro', schemaLibro)
module.exports = Model