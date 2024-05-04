const { createPedidoMongo } = require("./PedidoActions")
const { login } = require('../Usuario/UsuarioController')
const { getLibrosFilter } = require("../Libro/LibroController")

async function createNewPedido(datos) {

    const { username, password, ...pedido } = datos
    const tokenJWT = await login({ username, password })

    if (typeof pedido.libro === "string") { //Significa que es solo un libro
        const _id = pedido.libro
        const libroObject = await getLibrosFilter({ _id })
        console.log(libroObject[0].propietario)
    } else {
        const _id1 = pedido.libro[0]
        const libroObject = await getLibrosFilter({ _id: _id1 })
        const propietario = libroObject[0].propietario

        if (propietario === username) {
            throw new Error(JSON.stringify({ code: 401, msg: "No puede comprarse sus propios libros. "}))
        }

        const librosPropietario = await getLibrosFilter({ propietario })
        const librosPropietarioIds = librosPropietario.map((libro) => libro._id.toString()) // Obtiene solo los IDs de los libros del propietario
        for (const libroId of pedido.libro) {
            if (!librosPropietarioIds.includes(libroId)) {
                throw new Error(JSON.stringify({ code: 401, msg: "Los libros no pertenecen al mismo autor." }))
            }
        }

        const newPedido = {
            ...pedido,
            "usuario":username,
            "usuarioVendedor": propietario,
            "fechaCreacion": new Date(),
            "estado": "En progreso",
        }

        const respuesta = await createPedidoMongo(newPedido)
        return respuesta
    }
    /*if (libros.length>1){
        const librosAutor = libros.filter((l)=>l.propietario !== propietario)
        if (librosAutot.length>0){
            throw new Error(JSON.stringify({ code: 401, msg: "Los libros no pertenecen al mismo vendedor. "}))
        }
    }*/
}

module.exports = {
    createNewPedido,
}