const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema({
    usuario: {type: Number, required: true}, //number para el id del usuario que compra
    usuarioVendedor: {type: Number, required: true},
    fechaCreacion: {type: Date, required: true},
    estado: {type: String, required: true},
    isCancelado: {type: Boolean, default: function() {
        return this.estado==='Cancelado' ? true : false
    }},
    isCompletado: {type: Boolean, default: function(){
        return this.estado==='Completado' ? true : false
    }},
    libro: {type: [String], required: true},
    direccionDestion: {type: String, required:true}
})


const Model = mongoose.model('Pedido', PedidoSchema);

module.exports = Model;