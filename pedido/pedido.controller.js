const { createOrderMongo,
    getOrdersMongo,
    updateOrderMongo
} = require("./pedido.actions")
const { getBooksMongo } = require("../libro/libro.actions")
const { generateToken, verifyToken } = require('../utils/auth');
const { getUsersMongo } = require("../usuario/usuario.actions");
const { query } = require("express");

async function getOrders(token, query) {

    const decodedToken = verifyToken(token)

    if (!decodedToken) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay pedido 🙊" }))
    }

    var orders

    if (!query.startDate && !query.endDate) {
        orders = await getOrdersMongo(query)
    } else {
        orders = await getOrdersMongo()
        const ordersDates = orders.filter(o => {
            const orderDate = o.createdAt.toISOString().split('T')[0]
            return orderDate >= query.startDate && orderDate <= query.endDate
        })
        orders = ordersDates
    }


    if ((!query.isCompleted || !query.isCancelled )&& !query.status) {
        const activeOrders = orders.filter((o) => !o.isCancelled && !o.isCompleted)
        return activeOrders
    }
    return orders
}

async function updateOrder(token, data){
    
    const decodedToken = verifyToken(token)

    if (!decodedToken) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay pedido 🙊" }))
    }

    const order = await getOrdersMongo({ _id: data._id })

    if (decodedToken.username === order[0].buyer) {
        if (!data.status || data.status !== "Completado") {
            throw new Error(JSON.stringify({ code: 401, msg: "Usted no puede cambiar la información de este pedido"}))
        } else {
            return await updateOrderMongo({_id: data._id}, {status: "Completado", isCompleted: true})
        }
    } else if (decodedToken.username === order[0].seller){
        if (!data.status || data.status !== "Cancelado") {
            throw new Error(JSON.stringify({ code: 401, msg: "Usted no puede cambiar la información de este pedido"}))
        } else {
            return await updateOrderMongo({_id: data._id}, {status: "Cancelado", isCancelled: true})
        }
    } else {
        throw new Error(JSON.stringify({ code: 401, msg: "Usted no tiene ese pedido en su lista, rectifique!!"}))
    }


}

async function getTotalPayment(books) {
    try {
        var accum = 0

        for (const b of books) {
            const book = await getBooksMongo({ _id: b })
            const total = book[0].price
            accum = accum + total
        }
        return accum
    } catch (error) {
        console.error(error)
        throw new Error(JSON.stringify({ code: 400, msg: "Presentamos problemas con su pedido, un momento ... 🙊" }))
    }
}

async function createOrder(token, data) {

    const decodedToken = verifyToken(token)

    if (!decodedToken) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay pedido 🙊" }))
    }

    var owner, book, totalPayment

    if (typeof data.book === "string" || data.book.length === 1) { // It means that user just request one book
        const _id = data.book
        book = await getBooksMongo({ _id })
        totalPayment = book[0].price
        owner = book[0].owner
        //console.log(book[0])
    } else {
        const _id1 = data.book[0]
        book = await getBooksMongo({ _id: _id1 })
        owner = book[0].owner

        if (owner === decodedToken.username) {
            throw new Error(JSON.stringify({ code: 401, msg: "No puede comprarse sus propios libros. " }))
        }

        ownerBooks = await getBooksMongo({ owner })
        const ownerBooksId = ownerBooks.map((b) => b._id.toString()) // Obtiene solo los IDs de los libros del propietario
        for (const id of data.book) {
            if (!ownerBooksId.includes(id)) {
                throw new Error(JSON.stringify({ code: 401, msg: "Los libros no pertenecen al mismo autor." }))
            }
        }
        totalPayment = await getTotalPayment(data.book)
    }

    const newOrder = {
        ...data,
        "buyer": decodedToken.username,
        "buyerPhone": (await (getUsersMongo({ username: decodedToken.username })))[0].phoneNumber,
        "seller": owner,
        "status": "En progreso",
        "total": totalPayment
    }

    const response = await createOrderMongo(newOrder)

    return response
}



module.exports = {
    createOrder,
    getOrders,
    updateOrder
}