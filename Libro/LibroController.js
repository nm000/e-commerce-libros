const { createNuevoLibroMongo, getLibrosMongo, getLibrosFilterMongo} = require("./LibroActions")
const { updateLibrosUsuario, login } = require('../Usuario/UsuarioController')

async function getLibros() {
    const libros = await getLibrosMongo()
    return libros
}

async function getLibrosFilter(query) {
    const {name, propietario, genero,  fechaPublicacion, casaEditorial,autor } = query 
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

module.exports = {
    createNuevoLibro,
    getLibros,
    getLibrosFilter,
}
