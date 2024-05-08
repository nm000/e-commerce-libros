const Pedido = require("./pedido.model")

async function getOrdersMongo(filters){ 
    const orders = await Pedido.find(filters)
    return orders
}

async function createOrderMongo(data){
    const order = await Pedido.create(data)
    return order
}

async function updateOrderMongo(_id,data){
    const order = await Pedido.findOneAndUpdate(_id,data)
    return order
}

async function deleteOrderMongo(_id,data){ // CHECK IF WE WILL USE A DELETE FOR ORDERS
    const order = await Pedido.findOneAndUpdate(_id,data)
    return order
}

module.exports = {
    createOrderMongo,
    getOrdersMongo,
    updateOrderMongo,
    deleteOrderMongo
}