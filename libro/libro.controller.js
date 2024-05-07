const { createBookMongo,
    getBooksMongo,
    getBookMongo,
    updateBookMongo,
    deleteBookMongo, } = require("./libro.actions")
const { updateBooksUserMongo } = require('../usuario/usuario.actions')
const { verifyToken } = require("../utils/auth")

async function getBooks() {
    const books = await getBooksMongo()
    const activeBooks = books.filter((b) => b.isActive)
    return activeBooks
}

async function getBook(query) {
    const { isActive, ...info } = query
    const books = await getBookMongo(query)
    if (!isActive) {
        const activeBooks = books.filter((b) => b.isActive)
        return activeBooks
    }
    return books
}

async function createBook(token, data) {

    const decodedToken = verifyToken(token)

    if (!decodedToken) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay pedido 🙊" }))
    }

    const { ...book } = data

    const bookInfo = {
        ...book,
        'owner': decodedToken.username,
        'fechaPublicacion': new Date(book.publicationDate)
    }

    try {
        const newBook = await createBookMongo(bookInfo)
        await updateBooksUserMongo({ username: decodedToken.username, bookId: newBook._id }) // CHECK: if it is newBook[0]._id or is in this way
        return newBook
    } catch (error) {
        throw new Error(JSON.stringify({ code: 400, msg: "Error al crear su libro 📖" }))
    }


}

async function updateBook(token, data) {

    const decodedToken = verifyToken(token)

    if (!decodedToken) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay pedido 🙊" }))
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

    try {
        const book = await getBookMongo({ _id: id })
        if (book[0].owner === decodedToken.username) {
            return await deleteBookMongo(id)
        } else {
            throw new Error(JSON.stringify({ code: 400, msg: "No puedes borrar un libro que no te pertenece." }))
        }

    } catch (error) {
        throw new Error(JSON.stringify({ code: 401, msg: "Error al actualizar la información 😯" }))
    }
}



module.exports = {
    createBook,
    getBooks,
    getBook,
    updateBook,
    deleteBook,
}
