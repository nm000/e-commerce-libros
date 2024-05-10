const jwt = require('jsonwebtoken');
require('dotenv').config()

function generateToken(user) {
    id = user[0]._id.toString()
    //Information that we're going to save in JWT is _id and username.
    return jwt.sign({ id: id, username: user[0].username }, process.env.SECRET);
}

function verifyToken(token) {
    if (token && token.startsWith('Bearer ')){
        const tokenJWT = token.slice(7)
        try {
            return jwt.verify(tokenJWT, process.env.SECRET)
        } catch (error){
            throw new Error (JSON.stringify({code: 401, msg: 'Token inválido' }))
        }
    } else {
        throw new Error (JSON.stringify({code: 401, msg: 'Token no proporcionado' }))
    }
}

module.exports = { generateToken, verifyToken };
