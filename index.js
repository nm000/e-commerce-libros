const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req,res) => {
    res.status(200).json({});
})

const rutasUsuario = require("./Usuario/UsuarioRoute")
app.use('/Usuario', rutasUsuario);


mongoose.connect('mongodb+srv://mendozanatalia0827:ujnObzsk6UmydYSG@cluster0.uidg9ve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    console.log("La conexión a DB se ha establecido")
    app.listen(8080, () => {
        console.log("Servidor escuchando en el puerto 8081")
    })
}).catch((error) => {
    console.error("Error al conectar a la BD", error)
})
;

app.listen(8081);