const {createNuevoLibroMongo} = require("./LibroActions")
const {login} = require('../Usuario/UsuarioController')

async function createNuevoLibro(datos){
    try {
        const { username, password, ...libro } = datos

        const tokenJWT = await login({username,password})

        if(!tokenJWT){
            throw new Error("Sin credenciales no hay libro 🙊")
        }

        const datosLibro = {
            ...libro,
            'propietario': username,
            'fechaPublicacion': new Date(libro.fechaPublicacion)
        }

        const nuevoLibro = await createNuevoLibroMongo(datosLibro)
        return nuevoLibro

    } catch(error){
        console.error("Error para crear su libro 📗", error)
        throw new Error(error.message)
    }
      

}

module.exports = {
    createNuevoLibro,
}