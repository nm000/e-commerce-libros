const express = require('express')
const router = express.Router();
const {createNuevoLibro} = require("./LibroController");

async function postLibro(req, res){
    try{
        await createNuevoLibro(req.body)
        res.status(200).json({
            mensaje: "Libro creado 😎"
        })
    } catch(e){
        res.status(500).json({
            mensaje: "Falló en crearse el libro 😢",
            error: e.message
        })
    }
}

router.post("/newLibro", postLibro)

module.exports = router;
