const express = require('express')
const router = express.Router();
const {createNuevoLibro} = require("./LibroController");

async function postLibro(req, res){
    try{
        await createNuevoLibro(req.body)
        res.status(200).json({
            mensaje: "Libro creado 😎"
        })
    } catch(error){
        const err = JSON.parse(error.message);
        res.status(err.code).json({
            mensaje: "Falló al crearse el libro 📒",
            err: err.msg,
        })
    }
}

router.post("/newLibro", postLibro)

module.exports = router;
