const express = require('express')
const router = express.Router();
const { getUsuariosTodos, getUsuario, createNuevoUsuario, updateUsuario, login } = require("./UsuarioController");

async function getUsuarios(req, res) {
    try {
        const usuarios = await getUsuariosTodos()
        res.status(200).json({
            ...usuarios
        })
    } catch (e) {

        res.status(500).json({ msg: "Problemas para encontrar los usuarios 😶" })
    }
}

async function getUsuarioFilter(req, res) {
    try {
        const usuario = await getUsuario(req.query)
        res.status(200).json({
            ...usuario
        })
    } catch (error) {
        const err = JSON.parse(error.mensaje)
        res.status(err.code).json({ mensaje: "Problemas para encontrar al usuario 😶" , err: err.msg})
    }
}

async function postUsuario(req, res) {
    try {
        await createNuevoUsuario(req.body)
        res.status(200).json({
            mensaje: "Nuevo usuario 😎"
        })
    } catch (error) {
        const err = JSON.parse(error.message);
        res.status(err.code).json({
            mensaje: "Falló al crear el usuario",
            err: err.msg,
        })
    }

}

async function patchUsuario(req, res) {
    try {
        await updateUsuario(req.body)
        res.status(200).json({
            mensaje: "Usuario actualizado 🙂"
        })
    } catch (e) {
        res.status(500).json({
            mensaje: "Falló al actualizarse la información 😞",
            err: e.msg
        })
    }
}

async function postLogin(req, res) {
    try {
        await login(req.body)
        res.status(200).json({
            mensaje: "Inicio éxitoso 🥳"
        })
    } catch (error) {
        const err = JSON.parse(error.message);
        res.status(err.code).json({
            mensaje: "Falló en iniciar sesión 😢",
            err: err.msg,
        })
    }
}

router.get("/", getUsuarios)
router.get("/getFilters", getUsuarioFilter)
router.post("/login", postLogin)
router.post("/create", postUsuario)
router.patch("/update", patchUsuario)

module.exports = router;
