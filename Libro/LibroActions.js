const Libro = require("./LibroModel")

async function getLibrosMongo(){
    const libros = await Libro.find()
    return libros
}

async function getLibrosFilterMongo(filtros){
    const libros = await Libro.find(filtros)
    return libros
}

async function createNuevoLibroMongo(datos){
    const libroCreado = await Libro.create(datos)
    return libroCreado
}

async function updateLibroMongo(_id,cambios){
    const respuesta = await Libro.findByIdAndUpdate(_id, cambios)
    return respuesta
}

async function deleteLibroMongo(_id){
    const respuesta = await Libro.findByIdAndUpdate(_id, {"isActive": false})
    return respuesta
}

module.exports = {
    createNuevoLibroMongo,
    getLibrosMongo,
    getLibrosFilterMongo,
    updateLibroMongo,
    deleteLibroMongo,
}