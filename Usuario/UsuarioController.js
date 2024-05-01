const { getUsuariosMongo, getUserMongo, createNuevoUsuarioMongo } = require("./UsuarioActions")
const { generateToken } = require('../utils/auth');
const CryptoJS = require("crypto-js")

async function getUsuariosTodos() {
    const usuarios = await getUsuariosMongo();
    return usuarios
}

async function getUsuario(query) {
    const { username, password, alias } = query
    const usuario = await getUserMongo(query)
    return usuario
}

async function createNuevoUsuario(datos) {
    const { username, password, alias } = datos

    datos.password = CryptoJS.MD5(datos.password).toString()

    const nuevoUsuarioCreado = await createNuevoUsuarioMongo(datos);

    return nuevoUsuarioCreado
}


async function login(datos) {
    try {
        const { username, password } = datos;

        const hashPassword = CryptoJS.MD5(password).toString()
        //console.log(hashPassword)
        const usuario = await getUserMongo({ username })
        if (!usuario || usuario.usuario.password !== hashPassword){
            throw new Error("Credenciales incorrectas")
        } 
        
        const token = generateToken({ id: usuario.usuario._id })
        console.log(token)
        
        return token

    } catch (error) {
        console.error("Error para iniciar sesión 😯", error)
        throw new Error(error.message)
    }

}



module.exports = {
    getUsuariosTodos,
    getUsuario,
    createNuevoUsuario,
    login,
}