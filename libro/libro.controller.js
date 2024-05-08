const { createBookMongo,
    getBooksMongo,
    updateBookMongo,
    deleteBookMongo, } = require("./libro.actions")
const { updateBooksUserMongo } = require('../usuario/usuario.actions')
const { verifyToken } = require("../utils/auth")

async function getBooks(query) {
    const books = await getBooksMongo(query)
    if (!query.isActive) {
        const activeBooks = books.filter((b) => b.isActive)
        return activeBooks
    }
    return books
}


async function createBook(token, data) {

    const decodedToken = verifyToken(token)
    console.log(decodedToken)

    if (!decodedToken) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay libro 🙊" }))
    }

    const { ...book } = data

    const bookInfo = {
        ...book,
        'owner': decodedToken.username,
        'fechaPublicacion': new Date(book.publicationDate)
    }

    try {
        const newBook = await createBookMongo(bookInfo)
        const response = await updateBooksUserMongo(decodedToken.username, newBook._id.toString())
        return newBook
    } catch (error) {
        console.log(error)
        throw new Error(JSON.stringify({ code: 400, msg: "Error al crear su libro 📖" }))
    }


}

async function updateBook(token, data) {

    const decodedToken = verifyToken(token)

    if (!decodedToken) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay libro 🙊" }))
    }

    const { _id, ...changes } = data

    var books
    try {

        if (!changes.isActive) {
            books = await getBookMongo({ owner: decodedToken.username, _id })
        } else {
            books = await getBookMongo({ owner: decodedToken.username, _id, isActive: true }) //PROBAR ESTO CON MÁS LIBROS
        }

        if (!books) {
            throw new Error(JSON.stringify({ code: 401, msg: "Usted no tiene un libro con esas características" }))
        }

        const response = await updateBookMongo(_id, changes)

        return response

    } catch (error) {
        throw new Error(JSON.stringify({ code: 401, msg: "Error al actualizar la información 😯" }))
    }
}

async function deleteBook(token, id) {
    const decodedToken = verifyToken(token)

    if (!decodedToken) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay pedido 🙊" }))
    }
    const book = await getBookMongo({ _id: id })
    console.log(book)
    if (book[0].owner === decodedToken.username) {
        try {
            return await deleteBookMongo(id)
        } catch (error) {
            throw new Error(JSON.stringify({ code: 401, msg: "Error al borrar el libro 😯" }))
        }
    } else {
        throw new Error(JSON.stringify({ code: 400, msg: "No puedes borrar un libro que no te pertenece." }))
    }

}



module.exports = {
    createBook,
    getBooks,
    updateBook,
    deleteBook,
}
