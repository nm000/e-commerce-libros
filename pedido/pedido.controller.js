const { createOrderMongo,
    getOrdersMongo,
    updateOrderMongo
} = require("./pedido.actions")
const { getBooksMongo, updateBookMongo } = require("../libro/libro.actions")
const { verifyToken } = require('../utils/auth');
const { getUsersMongo } = require("../usuario/usuario.actions");


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


async function updateStatusBooks(orderId){
    const order = await getOrdersMongo({_id:orderId})
    const books = order[0].book
    console.log(books)
    for (let book in books) {
        console.log(books[book])
        await updateBookMongo({_id:books[book]}, {isActive: false, isDisponible: false, numberOfUnits: 0})
    }
}

async function updateOrder(token, data){
    
    const decodedToken = verifyToken(token)

    if (!decodedToken) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay pedido 🙊" }))
    }

    const order = await getOrdersMongo({ _id: data._id })

    if (decodedToken.username === order[0].buyer) {
        if (!data.status || data.status !== "Cancelado") {
            throw new Error(JSON.stringify({ code: 401, msg: "Usted no puede cambiar la información de este pedido"}))
        } else {
            const response = await updateOrderMongo({_id: data._id}, {status: "Cancelado", isCancelled: true})
            return response
        }
    } else if (decodedToken.username === order[0].seller){
        if (!data.status || (data.status !== "Cancelado" && data.status!=="Completado")) {
            throw new Error(JSON.stringify({ code: 401, msg: "Usted no puede cambiar la información de este pedido"}))
        } else if (data.status === "Cancelado") {
            return await updateOrderMongo({_id: data._id}, {status: data.status, isCancelled: true})
        } else {
            const response =  await updateOrderMongo({_id: data._id}, {status: data.status, isCompleted: true})
            await updateStatusBooks(data._id)
            return response
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

function getCountOfBooks(books){
    let booksUnitsRequired = {}

    books.forEach(book => {
        if (!booksUnitsRequired[book]) {
            booksUnitsRequired[book] = 1
        } else {
            booksUnitsRequired[book]++
        }
    })

    console.log(booksUnitsRequired)

    return booksUnitsRequired
}

function validateBookIsAvailable(book, units){
    if (book.isActive && (book.numberOfUnits >= units)){
        return true
    }
    return false
}


async function createOrder(token, data) {

    const decodedToken = verifyToken(token) // verify the auth header

    if (!decodedToken) { // person did not attach the auth
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay pedido 🙊" }))
    }

    var owner, book, totalPayment 
    var booksQuantity = getCountOfBooks(data.book)

    if (typeof data.book === "string" || data.book.length === 1) { // It means that user just request one book
        const _id = data.book
        book = await getBooksMongo({ _id: _id })
        if (!validateBookIsAvailable(book[0], 1)){
            throw new Error(JSON.stringify({ code: 400, msg: "El libro no está disponible para la compra"}))
        }

        totalPayment = book[0].price
        owner = book[0].owner    
        //console.log(book[0])
    } else {
        let booksData = []
        for (const b of data.book) {
            const book = await getBooksMongo({ _id: b })
            booksData.push(book)
        }
        //console.log(booksData)
        const ownerBooks = await getBooksMongo({ owner: booksData[0][0].owner })
        const ownerBooksId = ownerBooks.map(b => b._id.toString())

        for (const book of booksData) {

            if (book[0].owner === decodedToken.username) {
                throw new Error(JSON.stringify({ code: 401, msg: "No puedes comprar tus propios libros." }));
            }

            if (!ownerBooksId.includes(book[0]._id.toString())) {
                throw new Error(JSON.stringify({ code: 401, msg: "Los libros no pertenecen al mismo autor." }));
            }

            //console.log(book[0], booksQuantity[book[0]._id.toString()])
            if (!validateBookIsAvailable(book[0], booksQuantity[book[0]._id.toString()])) {
                throw new Error(JSON.stringify({ code: 400, msg: "El libro no está disponible para la compra o está solicitando más unidades de las disponibles"}));
            }
        }

        owner = booksData[0][0].owner
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

    try{
        const response = await createOrderMongo(newOrder)
        return response
    } catch(error){
        throw new Error(JSON.stringify({ code: 400, msg: "Error al crear su pedido, intente más tarde!", err: error }))
    }

    
}



module.exports = {
    createOrder,
    getOrders,
    updateOrder
}