const Usuario = require("./usuario.model")

async function getUsersMongo(){
    const usuarios = await Usuario.find()
    //console.log(usuarios)
    return usuarios
}

async function getUserMongo(filters){
    const usuario = await Usuario.find(filters)
    return usuario
}

async function createUserMongo(data){
    const usuarioCreado = await Usuario.create(data)
    return usuarioCreado
}

async function updateUserMongo(username, data){
    const usuario = await Usuario.findOneAndUpdate({username},data)
    return usuario
}

async function updateBooksUserMongo(username, bookId){
    return await Usuario.findOneAndUpdate({username},{$push:{book:bookId}},{new:true})
}

async function deleteUserMongo(_id){
    return await Usuario.findOneAndUpdate({_id}, {isActive: false})
}

module.exports = {
    getUsersMongo,
    getUserMongo,
    createUserMongo,
    updateUserMongo,
    updateBooksUserMongo,
    deleteUserMongo,
}