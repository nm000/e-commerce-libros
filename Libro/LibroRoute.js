const express = require('express')
const router = express.Router();
const {createNuevoLibro, getLibros, getLibrosFilter, updateLibro, deleteLibro} = require("./LibroController");

async function getAllLibros(req, res){
    try{
        const libros = await getLibros()
        res.status(200).json({
            ...libros
        })
    } catch(error){
        const err = JSON.parse(error.message)
        res.status(err.code).json({
            mensaje: "Falló al obtener libros 📚",
            err: err.msg
        })
    }
}

async function getLibrosFilters(req, res){
    try {
        const libros = await getLibrosFilter(req.query)
        res.status(200).json({
            ...libros
        })
    }catch(error){
        const err = JSON.parse(error.message)
        res.status(err.code).json({
            mensaje: "Falló al obtener libros 📚",
            err: err.msg
        })
    }
}

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
            err: err.msg
        })
    }
}

async function patchLibro(req, res){
    try {
        await updateLibro(req.body)
        res.status(200).json({
            mensaje: "Libro actualizado!"
        })
    }catch(error){
        const err = JSON.parse(error.message)
        res.status(err.code).json({
            mensaje: "Falló al hacer actualizaciones",
            err: err.msg
        })
    }
}

async function deleteBorrarLibro(req, res){
    try{
        await deleteLibro(req.body)
        res.status(200).json({
            mensaje: "Libro eliminado!"
        })
    }catch(error){
        const err = JSON.parse(error.message)
        res.status(err.code).json({
            mensaje: "Falló al borrar el libro",
            err: err.msg
        })
    }
}

router.get("/", getAllLibros)
router.get("/filters", getLibrosFilters)
router.post("/newLibro", postLibro)
router.patch("/update", patchLibro)
router.delete("/delete", deleteBorrarLibro)
module.exports = router;
