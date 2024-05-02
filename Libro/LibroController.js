const { createNuevoLibroMongo, getLibrosMongo, getLibrosFilterMongo, updateLibroMongo, deleteLibroMongo} = require("./LibroActions")
const { updateLibrosUsuario, login } = require('../Usuario/UsuarioController')

async function getLibros() {
    const libros = await getLibrosMongo()
    return libros
}

async function getLibrosFilter(query) {
    const { name, propietario, genero,  fechaPublicacion, casaEditorial,autor } = query 
    const libros = await getLibrosFilterMongo(query)
    return libros
}

async function createNuevoLibro(datos) {
    try {
        const { username, password, ...libro } = datos

        const tokenJWT = await login({ username, password })

        /*if (!tokenJWT) {
            throw new Error(JSON.stringify({ code: 501, msg: "Sin credenciales no hay libro 🙊" }))
        }*/

        const datosLibro = {
            ...libro,
            'propietario': username,
            'fechaPublicacion': new Date(libro.fechaPublicacion)
        }

        const nuevoLibro = await createNuevoLibroMongo(datosLibro)

        await updateLibrosUsuario({ username: username, libroId: nuevoLibro._id })
        return nuevoLibro
    } catch (error) {
        throw new Error(JSON.stringify({ code: 401, msg: "Error al crear su libro 📖" }))
    }
}

async function updateLibro(datos){
    try {

        const {username, password, _id, ...cambios} = datos

        const tokenJWT = await login({ username, password })

        const libros = await getLibrosFilter({propietario:username, _id})

        if (!libros || !libros.libros){
            throw new Error(JSON.stringify({code: 401, msg: "Usted no tiene un libro con esas características"}))
        }

        const respuesta = await updateLibroMongo(_id, cambios)
        
        return respuesta

    }catch(error){
        throw new Error(JSON.stringify({code: 401, msg: "Error al actualizar la información 😯"}))
    }
}

async function deleteLibro(datos){
    try {
        const {username, password, _id} = datos

        const tokenJWT = await login({ username, password })

        return await deleteLibroMongo(_id)
    } catch(error){
        throw new Error(JSON.stringify({code: 401, msg: "Error al actualizar la información 😯"}))
    }
}



module.exports = {
    createNuevoLibro,
    getLibros,
    getLibrosFilter,
    updateLibro,
    deleteLibro,
}
