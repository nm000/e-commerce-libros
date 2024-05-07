const express = require('express')
const router = express.Router()
const { createBook,
    getBooks,
    getBook,
    updateBook,
    deleteBook,} = require("./libro.controller")

async function getForBooks(req, res){
    try{
        const books = await getBooks()
        res.status(200).json({
            ...books
        })
    } catch(error){
        const err = JSON.parse(error.message)
        res.status(err.code).json({
            mensaje: "Falló al obtener libros 📚",
            err: err.msg
        })
    }
}

async function getForBook(req, res){
    try {
        const books = await getBook(req.query)
        res.status(200).json({
            ...books
        })
    }catch(error){
        const err = JSON.parse(error.message)
        res.status(err.code).json({
            mensaje: "Falló al obtener libros 📚",
            err: err.msg
        })
    }
}

async function postBook(req, res){
    try{
        await createBook(req.headers['authorization'],req.body)
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

async function patchBook(req, res){
    try {
        await updateBook(req.headers['authorization'],req.body)
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

async function deleteForBook(req, res){
    try{
        await deleteBook(req.headers['authorization'],req.body)
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

router.get("/", getForBooks)
router.get("/filtros", getForBook)
router.post("/nuevoLibro", postBook)
router.patch("/actualizarLibro", patchBook)
router.delete("/borrarLibro", deleteForBook)
module.exports = router;
