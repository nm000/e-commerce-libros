const { getUsersMongo,
    createUserMongo,
    updateUserMongo,
    deleteUserMongo,
} = require("./usuario.actions")
const { getBooksMongo, updateBookMongo } = require("../libro/libro.actions")
const { generateToken, verifyToken } = require('../utils/auth')
const CryptoJS = require("crypto-js")

async function getUsers(token, query) {

    const decodedToken = verifyToken(token)

    const {password, ...info} = query

    if (!password){
        const users = await getUsersMongo(query)
        if (users.length === 0){
            throw new Error(JSON.stringify({code: 404, msg: "No hay un usuario con esa información"}))
        }
        if (!query.isActive) { // Check if user is active to show up
            const activeUsers = users.filter((u) => u.isActive)
            return activeUsers
        }
        return users
    }

    throw new Error(JSON.stringify({code: 403, msg: "No es posible filtrar su contraseña!!"}))
}


async function createUser(data) {
    const { username, password, fullName, phoneNumber, alias } = data

    if ((await getUsersMongo({ username })).length === 0) {
        data.password = CryptoJS.MD5(data.password).toString()

        const user = await createUserMongo(data)

        return user
    }
    throw new Error(JSON.stringify({ code: 409, msg: "Ya existe un usuario con ese username" }))
}

async function updateUser(token, data) {

    const decodedToken = verifyToken(token)

    if(!(data.username === undefined)){ // username is immutable in the model, however the user have to know that he is not able to change this information.
        throw new Error(JSON.stringify({ code: 403, msg: "No es posible cambiar su usuario!"}))
    }

    if (!(data.password===undefined)){
        data.password = CryptoJS.MD5(data.password).toString()
    }

    try{
        const user = await updateUserMongo(decodedToken.username, data)
        return user
    } catch(error){
        throw new Error(JSON.stringify({code: 500, msg:"Tuvimos problemas al actualizar su información"}))
    }
    

}

//When we delete an user, their books will be delete too. This function changes the status of isActive to false.
async function updateStatusBooks(username){
    const books = await getBooksMongo({ owner:username, isActive:true })
    //console.log(books)
    if (books.length!==0) {
        for (let book in books) {
            await updateBookMongo({_id:books[book]._id.toString()}, {isActive: false, isDisponible: false, numberOfUnits: 0})
        }
    }
    return true
}



async function deleteUser(token) {

    const decodedToken = verifyToken(token)

    try {
        const user = await deleteUserMongo(decodedToken.id)
        //console.log(user)
        const deleteBooks = await updateStatusBooks(decodedToken.username)
        //console.log(deleteBooks)
        return user
    }catch(error){
        throw new Error(JSON.stringify({ code: 500, msg: "Error al borrar su cuenta, intente más tarde !!"}))
    }

}

async function login(datos) {

    const { username, password } = datos

    const hashPassword = CryptoJS.MD5(password).toString()
    
    const usuario = await getUsersMongo({ username })
    if (!usuario[0] || usuario[0].password !== hashPassword) {
        throw new Error(JSON.stringify({ code: 401, msg: "Credenciales incorrectas 😑" }))
    }

    const token = generateToken(usuario)
    //console.log(token)

    return token

}



module.exports = {
    getUsers,
    createUser,
    updateUser,
    login,
    deleteUser,
}