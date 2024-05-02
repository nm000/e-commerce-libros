const Libro = require("./LibroModel")

async function getLibrosMongo(){
    const libros = await Libro.find()
    return {libros: libros}
}

async function getLibrosFilterMongo(filtros){
    const libros = await Libro.findOne(filtros)
    return {libros: libros}
}

async function createNuevoLibroMongo(datos){
    const libroCreado = await Libro.create(datos)
    return libroCreado
}

module.exports = {
    createNuevoLibroMongo,
    getLibrosMongo,
    getLibrosFilterMongo
}