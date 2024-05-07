const express = require('express')
const router = express.Router();
const {createOrder} = require('./pedido.controller')

async function postOrder(req, res){
    try {
        await createOrder(req.headers['authorization'],req.body)
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

router.post("/nuevoPedido", postOrder)
module.exports = router;
