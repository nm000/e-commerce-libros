const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get("/", (req,res) => {
    res.status(200).json({})
})

const rutasUsuario = require("./usuario/usuario.route")
const rutasLibros = require("./libro/libro.route")
const rutasPedido = require("./pedido/pedido.route")
app.use('/Usuario', rutasUsuario)
app.use('/Libro', rutasLibros)
app.use('/Pedido', rutasPedido)


mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.uidg9ve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
    console.log("La conexión a DB se ha establecido")
    app.listen(8001, () => {
        console.log("Servidor escuchando en el puerto 8001")
    })
}).catch((error) => {
    console.error("Error al conectar a la BD", error)
})


//app.listen(8000);