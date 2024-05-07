const mongoose = require("mongoose");

const schemaPedido = new mongoose.Schema({
    buyer: {type: String, required: true}, //ID number for person who makes the order
    buyerPhone: {type: String, required: true},
    seller: {type: String, required: true},
    status: {type: String, required: true},
    book: {type: [String], required: true},
    dropOffAddress: {type: String, required:true},
    total: {type: Number, required:true},
    isCancelled: {type: Boolean, default: function() {
        return this.estado==='Cancelado' ? true : false
    }},
    isCompleted: {type: Boolean, default: function(){
        return this.estado==='Completado' ? true : false
    }},
}, {
    versionKey: false,
    timestamps: true
})


const Model = mongoose.model('Pedido', schemaPedido);

module.exports = Model;