const express = require('express')
const router = express.Router();
const { createNuevoUsuario } = require("./UsuarioController");

async function postUsuario(req, res){
    try {
        await createNuevoUsuario(req.body)
        res.status(200).json({
            mensaje: "Nuevo usuario 😎"
        })
    } catch (e) {
        const err = JSON.parse(e.message);
        res.status(err.code).json({
        mensaje: "Falló en crearse el usuario 😢",
        err: err.msg,
    })
    }

}

router.post("/", postUsuario)

module.exports = router;
