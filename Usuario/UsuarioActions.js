const Usuario = require("./UsuarioModel")

async function getUsuariosMongo(){
    const usuarios = await Usuario.find().select(["-password"])
    //console.log(usuarios)
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

async function updateUsuarioMongo(username, datos){
    const usuario = await Usuario.findOneAndUpdate({username},datos)
    return usuario
}

async function updateLibrosUsuarioMongo(username, libroId){
    return await Usuario.findOneAndUpdate({username},{$push:{libro:libroId}},{new:true})
}

module.exports = {
    getUsuariosMongo,
    getUserMongo,
    createNuevoUsuarioMongo,
    updateUsuarioMongo,
    updateLibrosUsuarioMongo,
}