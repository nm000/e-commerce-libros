const express = require('express')
const router = express.Router();
const {createNewPedido} = require('./PedidoController')

async function postPedido(req, res){
    try {
        await createNewPedido(req.body)
        res.status(200).json({
            mensaje: "Pedido creado!"
        })
    }catch(error){
        const err = JSON.parse(error.message)
        res.status(err.code).json({
            mensaje: "Problemas para crear el pedido 😐",
            err: err.msg
        })
    }
}

router.post("/newPedido", postPedido)
module.exports = router;
