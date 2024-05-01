const { getUsuariosMongo, getUserMongo, createNuevoUsuarioMongo, updateUsuarioMongo, updateLibrosUsuarioMongo } = require("./UsuarioActions")
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

async function updateUsuario(datos) {

    const { username, password, ...cambios } = datos

    const tokenJWT = await login({ username, password })

    if (!tokenJWT) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay libro 🙊" }))
    }

    const usuario = await updateUsuarioMongo(username, cambios)
    return usuario

}


async function login(datos) {

    const { username, password } = datos;

    const hashPassword = CryptoJS.MD5(password).toString()
    //console.log(hashPassword)
    const usuario = await getUserMongo({ username })
    if (!usuario.usuario || usuario.usuario.password !== hashPassword) {
        throw new Error(JSON.stringify({ code: 401, msg: "Credenciales incorrectas" }))
    }

    const token = generateToken({ id: usuario.usuario._id })
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
}