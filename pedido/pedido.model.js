const mongoose = require("mongoose");

const schemaPedido = new mongoose.Schema({
    buyer: {type: String, required: true}, // username for person who makes the order.
    buyerPhone: {type: String, required: true},
    seller: {type: String, required: true}, // username for person who is owner of the books.
    status: {type: String, required: true},
    book: {type: [String], required: true},
    dropOffAddress: {type: String, required:true},
    total: {type: Number, required:true},
    isCancelled: {type: Boolean, default: false},
    isCompleted: {type: Boolean, default: false},
    isActive: {type: Boolean, default: true}
}, {
    versionKey: false,
    timestamps: true
})


const Model = mongoose.model('Pedido', schemaPedido);

module.exports = Model;