const { createOrderMongo } = require("./pedido.actions")
const { getLibro } = require("../libro/libro.actions")
const { generateToken, verifyToken } = require('../utils/auth');
const { getUserMongo } = require("../usuario/usuario.actions");

async function createOrder(token, data) {

    const decodedToken = verifyToken(token)

    if (!decodedToken) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay pedido 🙊" }))
    }

    const { ...order } = data

    if (typeof order.book === "string" || order.book.length() === 1) { // It means that user just request one book
        const _id = order.libro
        const book = await getBooksMongo({ _id })
        const totalPayment = book[0].total
        //console.log(book[0])
    } else {
        const _id1 = order.libro[0]
        const book = await getLibrosFilter({ _id: _id1 })
        const owner = book[0].owner

        if (owner === decodedToken.username) {
            throw new Error(JSON.stringify({ code: 401, msg: "No puede comprarse sus propios libros. "}))
        }

        const ownerBooks = await getBooksMongo({ propietario })
        const ownerBooksId = ownerBooks.map((b) => b._id.toString()) // Obtiene solo los IDs de los libros del propietario
        for (const id of order.book) {
            if (!ownerBooksId.includes(id)) {
                throw new Error(JSON.stringify({ code: 401, msg: "Los libros no pertenecen al mismo autor." }))
            }
        }
    }
         
    const totalPayment = book.reduce(async (accum,book) => {
        accum + (await getBooksMongo({_id: book}))[0].total, 0
    })

    const newOrder = {
        ...pedido,
        "buyer": decodedToken.username,
        "buyerPhone": (await(getUserMongo({username: decodedToken.username})))[0].phoneNumber,
        "saller": owner,
        "status": "En progreso",
        "total": totalPayment
    }

    const response = await createOrderMongo(newOrder)
    return response
}
    /*if (libros.length>1){
        const librosAutor = libros.filter((l)=>l.propietario !== propietario)
        if (librosAutot.length>0){
            throw new Error(JSON.stringify({ code: 401, msg: "Los libros no pertenecen al mismo vendedor. "}))
        }
    }*/


module.exports = {
    createOrder,
}