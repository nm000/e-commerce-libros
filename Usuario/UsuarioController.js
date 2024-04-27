const { createNuevoUsuarioMongo } = require("./UsuarioActions")

async function createNuevoUsuario(datos){
    const { username, password, alias } = datos

    const nuevoUsuarioCreado = await createNuevoUsuarioMongo(datos);

    return nuevoUsuarioCreado
}

module.exports = {
    createNuevoUsuario,
}