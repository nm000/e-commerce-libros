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
        throw new Error(JSON.stringify({ code: 500, msg: "Error al crear su libro 📖" }))
    }


}

async function updateBook(token, data) {

    const decodedToken = verifyToken(token)

    const { _id, owner, ...changes } = data

    var books  = await getBooksMongo({ owner: decodedToken.username, _id: _id, isActive: true })
        //console.log(books)
    
    if (books.length===0) {
        throw new Error(JSON.stringify({ code: 404, msg: "Usted no tiene un libro con esas características" }))
    }
   
    if (!owner){
    
        try {   
            const response = await updateBookMongo({_id: _id}, changes)
    
            return response
    
        } catch (error) {
            throw new Error(JSON.stringify({ code: 500, msg: "Error al actualizar la información 😯" }))
        }
    } 
    throw new Error(JSON.stringify({ code: 403, msg: "Usted no puede modificar esa información 😐"}))

   
}

async function deleteBook(token, id) {
    const decodedToken = verifyToken(token)

    const book = await getBooksMongo({ _id: id, isActive: true })
    
    if (book[0].owner === decodedToken.username) {
        try {
            return await deleteBookMongo(id)
        } catch (error) {
            throw new Error(JSON.stringify({ code: 500, msg: "Error al borrar el libro 😯" }))
        }
    } else {
        throw new Error(JSON.stringify({ code: 403, msg: "No puedes borrar un libro que no te pertenece." }))
    }

}



module.exports = {
    createBook,
    getBooks,
    updateBook,
    deleteBook,
}
