const { createOrderMongo,
    getOrdersMongo,
    updateOrderMongo,
    deleteOrderMongo
} = require("./pedido.actions")
const { getBooksMongo, updateBookMongo } = require("../libro/libro.actions")
const { verifyToken } = require('../utils/auth')
const { getUsersMongo, updateUserMongo } = require("../usuario/usuario.actions")


async function getOrders(token, query) {

    const decodedToken = verifyToken(token)

    var orders

    if (!query.startDate && !query.endDate) { //Filter between two dates.
        orders = await getOrdersMongo(query)
    } else {
        const { startDate, endDate, ...data } = query
        orders = await getOrdersMongo(data)
        const ordersDates = orders.filter(o => {
            const orderDate = o.createdAt.toISOString().split('T')[0]
            return orderDate >= query.startDate && orderDate <= query.endDate
        })
        orders = ordersDates
    }

    var myOrders = orders.filter((order) => order.buyer === decodedToken.username || order.seller === decodedToken.username)
    
    if (myOrders.length === 0) {
        throw new Error(JSON.stringify({ code: 404, msg: "No hay ordenes a su nombre o con esas características" }))
    }


    if (!query.isCancelled && !query.isActive) {
        //If user does not try to get an order that was already completed or deleted, we will filter the information
        return myOrders.filter((order) => (!order.isCancelled && order.isActive))
    } else {
        //If user wants to know for a "cancel" or completed order, we will give him the information.
        return myOrders
    }

}


async function updateStatusBooks(orderId) {
    const order = await getOrdersMongo({ _id: orderId })

    const books = order[0].book
    for (let book in books) {
        return await updateBookMongo({ _id: books[book] }, { isActive: false, isAvailable: false, numberOfUnits: 0 })
    }
}

async function updateUserBooks(username) {
    const books = await getBooksMongo({ owner: username })
    var activeBooks = []
    activeBooks = books.filter((book) => book.isActive).map((book) => book._id.toString())
    //console.log(activeBooks)
    return await updateUserMongo(username, { book: activeBooks })
}

async function updateOrder(token, data) {

    const decodedToken = verifyToken(token)

    const { _id, status, ...other } = data


    if (Object.keys(other).length > 0 || !status) {
        throw new Error(JSON.stringify({ code: 403, msg: "Usted solo puede cambiar el estado del pedido!!" }))
    } else {
        const order = await getOrdersMongo({ _id: _id, isActive: true })

        if (order.length === 0) {
            throw new Error(JSON.stringify({ code: 404, msg: "No hay información de ese pedido" }))
        }

        const orderData = order[0]

        if (orderData.status !== "En progreso") {
            throw new Error(JSON.stringify({ code: 403, msg: "No es posible acceder a ese pedido" }))
        }

        if (decodedToken.username !== orderData.buyer && decodedToken.username !== orderData.seller) {
            throw new Error(JSON.stringify({ code: 404, msg: "Usted no tiene ese pedido en su lista, rectifique!!" }))
        }

        if (decodedToken.username === orderData.buyer) {
            if (status !== "Cancelado") {
                throw new Error(JSON.stringify({ code: 403, msg: "Usted no puede cambiar el estado de este pedido" }))
            }
            return await updateOrderMongo({ _id: _id }, { status: "Cancelado", isCancelled: true })
        }

        if (decodedToken.username === orderData.seller) {
            if (status !== "Cancelado" && status !== "Completado") {
                throw new Error(JSON.stringify({ code: 403, msg: "Usted no puede cambiar el estado de este pedido" }))
            }

            if (status === "Cancelado") {
                return await updateOrderMongo({ _id: _id }, { status: status, isCancelled: true })
            }

            const response = await updateOrderMongo({ _id: _id }, { status: status, isCompleted: true })
            await updateStatusBooks(_id)
            await updateUserBooks(decodedToken.username)
            return response
        }
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
        //console.error(error)
        throw new Error(JSON.stringify({ code: 500, msg: "Presentamos problemas con su pedido, un momento ... 🙊" }))
    }
}

function getCountOfBooks(books) {
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

function validateBookIsAvailable(book, units) {
    if (book.isActive && (book.numberOfUnits >= units)) {
        return true
    }
    return false
}


async function createOrder(token, data) {

    const decodedToken = verifyToken(token) // verify the auth header

    var owner, totalPayment
    var booksQuantity = getCountOfBooks(data.book) // To know how many units of each book will buy the person

        let booksData = []
        for (const b of data.book) {
            const book = await getBooksMongo({ _id: b, isActive: true})
            if (book.length === 0){
                throw new Error(JSON.stringify({ code: 404, msg: `El libro ${b} no existe`}))
            }
            booksData.push(book)
        }

        //console.log(booksData)
        

        for (const book of booksData) {

            if (book[0].owner === decodedToken.username) {
                throw new Error(JSON.stringify({ code: 400, msg: "No puedes comprar tus propios libros." }))
            }

            const ownerBooks = await getBooksMongo({ owner: booksData[0][0].owner, isActive: true })

            if (ownerBooks.length === 0){
                throw new Error(JSON.stringify({ code: 400, msg: "El autor no tiene libros disponibles."}))
            }
            const ownerBooksId = ownerBooks.map(b => b._id.toString())

            if (!ownerBooksId.includes(book[0]._id.toString())) {
                throw new Error(JSON.stringify({ code: 400, msg: "Los libros no pertenecen al mismo autor." }))
            }


            //console.log(book[0], booksQuantity[book[0]._id.toString()])
            if (!validateBookIsAvailable(book[0], booksQuantity[book[0]._id.toString()])) {
                throw new Error(JSON.stringify({ code: 409, msg: "El libro no está disponible para la compra o está solicitando más unidades de las disponibles" }))
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

    try {
        const response = await createOrderMongo(newOrder)
        return response
    } catch (error) {
        throw new Error(JSON.stringify({ code: 500, msg: "Error al crear su pedido, intente más tarde!"}))
    }

}

async function deleteOrder(token, id){
    const decodedToken = verifyToken(token) // verify the auth header

    const order = await getOrdersMongo({_id: id, buyer: decodedToken.username, isActive: true})

    if(order.length === 0){
        throw new Error(JSON.stringify({ code: 404, msg: "Usted no ha creado una orden para borrar"}))
    }

    try{
        const response = await deleteOrderMongo({_id: id}, {isActive: false})
        return response
    } catch(error){
        throw new Error(JSON.stringify({code: 500, msg: "Error al borrar su orden, intente luego!"}))
    }

}


module.exports = {
    createOrder,
    getOrders,
    updateOrder,
    deleteOrder
}