const express = require('express')
const router = express.Router();
const {getUsuariosTodos, getUsuario, createNuevoUsuario, login} = require("./UsuarioController");

async function getUsuarios(req, res){
    try {
        const usuarios = await getUsuariosTodos()
        res.status(200).json({
            ...usuarios
        })
    } catch(e) {
        res.status(500).json({msg: "Problemas para encontrar los usuarios 😶"})
    }
}

async function getUsuarioFilter(req, res){
    try {
        const usuario = await getUsuario(req.query)
        res.status(200).json({
            ...usuario
        })
    } catch(e) {
        res.status(500).json({msg: "Problemas para encontrar al usuario 😶"})
    }
}

async function postUsuario(req, res){
    try {
        await createNuevoUsuario(req.body)
        res.status(200).json({
            mensaje: "Nuevo usuario 😎"
        })
    } catch (e) {
        res.status(500).json({
        mensaje: "Falló en crearse el usuario 😢",
        err: err.msg,
    })
    }

}

async function postLogin(req, res){
    try {
        await login(req.body)
        res.status(200).json({
            mensaje: "Inicio éxitoso 🥳"
        })
    } catch(error) {
        res.status(500).json({
        mensaje: "Falló en iniciar sesión 😢",
        err: error.msg,
        })
    }
}

router.get("/", getUsuarios)
router.get("/Filters", getUsuarioFilter)
router.post("/login", postLogin)
router.post("/newUser", postUsuario)

module.exports = router;
