const Usuario = require("./UsuarioModel")

async function getUsuariosMongo(){
    const usuarios = await Usuario.find()
    console.log(usuarios)
    return {usuarios: usuarios}
}

async function getUserMongo(filters){
    const usuario = await Usuario.findOne(filters)
    return {usuario: usuario}
}

async function createNuevoUsuarioMongo(datos){
    const usuarioCreado = await Usuario.create(datos)
    return usuarioCreado
}

module.exports = {
    getUsuariosMongo,
    getUserMongo,
    createNuevoUsuarioMongo,
}