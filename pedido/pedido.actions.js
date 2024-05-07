const Pedido = require("./pedido.model")

async function createOrderMongo(datos){
    const pedido = await Pedido.create(datos)
    return pedido
}

module.exports = {
    createOrderMongo
}