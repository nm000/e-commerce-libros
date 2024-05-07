const Libro = require("./libro.model")

async function getBooksMongo(){
    const books = await Libro.find()
    return books
}

async function getBookMongo(filters){
    const books = await Libro.find(filters)
    return books
}

async function createBookMongo(data){
    const book = await Libro.create(data)
    return book
}

async function updateBookMongo(_id,changes){
    const response = await Libro.findByIdAndUpdate(_id, changes)
    return response
}

async function deleteBookMongo(_id){
    const response = await Libro.findByIdAndUpdate(_id, {"isActive": false})
    return response
}

module.exports = {
    createBookMongo,
    getBooksMongo,
    getBookMongo,
    updateBookMongo,
    deleteBookMongo,
}