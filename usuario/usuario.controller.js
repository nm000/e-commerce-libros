const { getUsersMongo,
    createUserMongo,
    updateUserMongo,
    updateBooksUserMongo,
    deleteUserMongo,
} = require("./usuario.actions")
const { generateToken, verifyToken } = require('../utils/auth');
const CryptoJS = require("crypto-js")

async function getUsers(query) {

    const users = await getUsersMongo(query)
    if (!query.isActive) {
        const activeUsers = users.filter((u) => u.isActive)
        return activeUsers
    }
    return users
}


async function createUser(data) {
    const { username, password, fullName, phoneNumber, alias } = data

    if ((await getUser({ username })).length === 0) {
        data.password = CryptoJS.MD5(data.password).toString()

        const user = await createUserMongo(data);

        return user
    }
    throw new Error(JSON.stringify({ code: 409, msg: "Ya existe un usuario con ese username" }))
}

async function updateUser(token, data) {

    const decodedToken = verifyToken(token)

    if (!decodedToken) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credenciales no hay modificacion 🙊" }))
    }

    const user = await updateUserMongo(decodedToken.username, data)
    return user

}

async function deleteUser(token, data) {

    const decodedToken = verifyToken(token)

    if (!decodedToken) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credeciales no se borra " }))
    }

    const user = await deleteUserMongo(decodedToken.id)
    return user

}

async function login(datos) {

    const { username, password } = datos;

    const hashPassword = CryptoJS.MD5(password).toString()
    //console.log(hashPassword)
    const usuario = await getUser({ username })
    if (!usuario[0] || usuario[0].password !== hashPassword) {
        throw new Error(JSON.stringify({ code: 401, msg: "Credenciales incorrectas 😑" }))
    }

    const token = generateToken(usuario)
    console.log(token)

    return token

}



module.exports = {
    getUsers,
    createUser,
    updateUser,
    login,
    deleteUser,
}