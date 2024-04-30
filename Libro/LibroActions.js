const Usuario = require("./LibroModel")

async function createNuevoLibroMongo(datos){
    const libroCreado = await Usuario.create(datos)
    return libroCreado
}

module.exports = {
    createNuevoLibroMongo,
}