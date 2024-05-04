const mongoose = require ("mongoose")

const UsuarioSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    alias: {type: String, required: true},
    direccion: {type: [String]}, //simular referenciado
    libro: {type: [String]},
    isActive: {type: Boolean, default: true}
}, {
    timestamps: true
})

const Model = mongoose.model('Usuario', UsuarioSchema);

module.exports = Model;