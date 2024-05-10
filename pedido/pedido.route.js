const express = require('express')
const router = express.Router();
const {createOrder,
    getOrders,
    updateOrder,
} = require('./pedido.controller')

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

async function getForOrders(req, res){
    try{
        const orders = await getOrders(req.headers['authorization'], req.query)
        res.status(200).json({
            ...orders
        })
    } catch(error){
        const err = JSON.parse(error.message)
        res.status(err.code).json({
            mensaje: "Problemas al obtener sus pedidos 😐",
            err: err.msg
        })
    }
}

async function patchOrder(req, res){
    try{
        const response = await updateOrder(req.headers['authorization'], req.body)
        res.status(200).json({
            mensaje: "ESTADO de pedido actualizado !!"
        })
    } catch(error){
        const err = JSON.parse(error.message)
        res.status(err.code).json({
            mensaje: "Problemas al actualizar su ESTADO 😐",
            err: err.msg
        })
    }
}

router.get("/", getForOrders)
router.post("/", postOrder)
router.patch("/", patchOrder)
module.exports = router;
