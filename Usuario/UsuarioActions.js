const Usuario = require("./UsuarioModel")

async function createNuevoUsuarioMongo(datos){
    const usuarioCreado = await Usuario.create(datos)
    return usuarioCreado
}

module.exports = {
    createNuevoUsuarioMongo,
}