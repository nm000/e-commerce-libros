const mongoose = require ("mongoose")

const schemaUsuario = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    fullName: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    alias: {type: String, required: true},
    libro: {type: [String]},
    isActive: {type: Boolean, default: true}
}, {
    versionKey: false,
    timestamps: true
})

const Model = mongoose.model('Usuario', schemaUsuario);

module.exports = Model;