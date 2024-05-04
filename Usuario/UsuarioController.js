const { getUsuariosMongo, getUserMongo, createNuevoUsuarioMongo, updateUsuarioMongo, updateLibrosUsuarioMongo, deleteUsuarioMongo } = require("./UsuarioActions")
const { generateToken, verifyToken } = require('../utils/auth');
const CryptoJS = require("crypto-js")

async function getUsuariosTodos() {
    const usuarios = await getUsuariosMongo();
    const usuariosActivos = usuarios.filter((u) => u.isActive)
    return usuariosActivos
}

async function getUsuario(query) {
    const { username, password, alias, isActive } = query
    const usuario = await getUserMongo(query)
    if (!isActive){
        const usuariosActivos = usuario.filter((u) => u.isActive)
        return usuariosActivos
    }
    return usuario
}

async function createNuevoUsuario(datos) {
    const { username, password, alias } = datos

    if (!(await getUsuario({ username })).usuario) {
        datos.password = CryptoJS.MD5(datos.password).toString()

        const nuevoUsuarioCreado = await createNuevoUsuarioMongo(datos);

        return nuevoUsuarioCreado
    }
    throw new Error(JSON.stringify({ code: 409, msg: "Ya existe un usuario con ese username" }))
}

async function updateLibrosUsuario(datos) {
    const { username, libroId } = datos
    return await updateLibrosUsuarioMongo(username, libroId)
}

async function updateUsuario(token, datos) {

    const decoded = verificarToken(token)

    if (!decoded) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay modificacion 🙊" }))
    }

    const usuario = await updateUsuarioMongo(decoded.username, datos)
    return usuario

}

async function deleteUsuario(datos){

    const {username, password, _id} = datos

    const tokenJWT = await login({ username, password })

    if (!tokenJWT) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay delete 🙊" }))
    }

    const usuario = await deleteUsuario(_id)
    return usuario

}


// Middleware para verificar el token JWT
function verificarToken(token) {

    if (token && token.startsWith('Bearer ')) {
        // Extrae el token eliminando 'Bearer ' del principio
        const tokenJWT = token.slice(7);
        try {
            // Verifica y decodifica el token JWT
            return verifyToken(tokenJWT)
        } catch (error) {
            // Maneja cualquier error que ocurra durante la verificación del token
            throw new Error (JSON.stringify({code: 401, msg: 'Token inválido' }))
        }
    } else {
        // Si no se proporciona un token en el encabezado de autorización
        throw new Error (JSON.stringify({code: 401, msg: 'Token no proporcionado' }))
    }
}

async function login(datos) {

    const { username, password } = datos;

    const hashPassword = CryptoJS.MD5(password).toString()
    //console.log(hashPassword)
    const usuario = await getUserMongo({ username })
    if (!usuario || usuario[0].password !== hashPassword) {
        throw new Error(JSON.stringify({ code: 401, msg: "Credenciales incorrectas 😑" }))
    }

    const token = generateToken( usuario )
    console.log(token)

    return token

}



module.exports = {
    getUsuariosTodos,
    getUsuario,
    createNuevoUsuario,
    updateUsuario,
    updateLibrosUsuario,
    login,
    verificarToken
}