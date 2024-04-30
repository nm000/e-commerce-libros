const { createNuevoUsuarioMongo } = require("./UsuarioActions")
const CryptoJS = require("crypto-js")

async function createNuevoUsuario(datos){
    const { username, password, alias } = datos

    datos.password  = CryptoJS.MD5(datos.password).toString();

    const nuevoUsuarioCreado = await createNuevoUsuarioMongo(datos);

    return nuevoUsuarioCreado
}

module.exports = {
    createNuevoUsuario,
}