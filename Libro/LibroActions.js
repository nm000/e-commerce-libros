const Libro = require("./LibroModel")

async function createNuevoLibroMongo(datos){
    const libroCreado = await Libro.create(datos)
    return libroCreado
}

module.exports = {
    createNuevoLibroMongo,
}