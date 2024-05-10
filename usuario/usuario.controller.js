const { getUsersMongo,
    createUserMongo,
    updateUserMongo,
    updateBooksUserMongo,
    deleteUserMongo,
} = require("./usuario.actions")
const { getBooksMongo, updateBookMongo } = require("../libro/libro.actions")
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

    if ((await getUsers({ username })).length === 0) {
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

//When we delete an user, their books will be delete too. This function changes the status of isActive to false.
async function updateStatusBooks(username){
    const books = await getBooksMongo({ owner:username })
    for (let book in books) {
        await updateBookMongo({_id:book._id.toString()}, {isActive: false, isDisponible: false, numberOfUnits: 0})
    }
}


async function deleteUser(token, data) {

    const decodedToken = verifyToken(token)

    if (!decodedToken) {
        throw new Error(JSON.stringify({ code: 400, msg: "Sin credeciales no se borra " }))
    }

    try {
        const user = await deleteUserMongo(decodedToken.id)
        await updateStatusBooks(decodedToken.username)
        return user
    }catch(error){
        throw new Error(JSON.stringify({ code: 400, msg: "Error al borrar su cuenta, intente más tarde !!"}))
    }

}

async function login(datos) {

    const { username, password } = datos;

    const hashPassword = CryptoJS.MD5(password).toString()
    
    const usuario = await getUsers({ username })
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