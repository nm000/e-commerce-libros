const express = require('express')
const router = express.Router();
const { getUsers,
    getUser,
    createUser,
    updateUser,
    login,
    deleteUser } = require("./usuario.controller");

async function getForUsers(req, res) {
    try {
        const usuarios = await getUsers(req.query)
        res.status(200).json({
            ...usuarios
        })
    } catch (error) {
        const err = JSON.parse(error.message);
        res.status(err.code).json({
            mensaje: "Problemas para encontrar los usuarios 😶",
            err: err.msg
        })
    }
}


async function postUser(req, res) {
    try {
        await createUser(req.body)
        res.status(200).json({
            mensaje: "Nuevo usuario 😎"
        })
    } catch (error) {
        const err = JSON.parse(error.message);
        res.status(err.code).json({
            mensaje: "Falló al crear el usuario",
            err: err.msg
        })
    }

}

async function patchUser(req, res) {
    try {
        await updateUser(req.headers['authorization'], req.body)
        res.status(200).json({
            mensaje: "Usuario actualizado 🙂"
        })
    } catch (error) {
        const err = JSON.parse(error.message)
        res.status(err.code).json({
            mensaje: "Falló al actualizarse la información 😞",
            err: err.msg
        })
    }
}

async function deleteForUser(req, res) {
    try {
        await deleteUser(req.headers['authorization'], req.body)
        res.status(200).json({
            mensaje: "Usuario eliminado 🙂"
        })
    } catch (error) {
        const err = JSON.parse(error.message)
        res.status(err.code).json({
            mensaje: "Falló al borrar su información 😞",
            err: err.msg
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
            err: err.msg
        })
    }
}

router.get("/", getForUsers)
router.post("/login", postLogin)
router.post("/", postUser)
router.patch("/", patchUser)
router.delete("/", deleteForUser)

module.exports = router;
