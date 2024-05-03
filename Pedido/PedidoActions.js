const Pedido = require("./PedidoModel")

async function createPedidoMongo(datos){
    const pedido = await Pedido.create(datos)
    return pedido
}

module.exports = {
    createPedidoMongo
}