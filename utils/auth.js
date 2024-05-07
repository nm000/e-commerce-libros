const jwt = require('jsonwebtoken');
secretKey = "secretOrPrivateKey must have a value"


function generateToken(user) {
    id = user[0]._id.toString()
    return jwt.sign({ id: id, username: user[0].username }, secretKey);
}

function verifyToken(token) {
    if (token && token.startsWith('Bearer ')){
        const tokenJWT = token.slice(7)
        try {
            jwt.verify(tokenJWT, secretKey)
        } catch (error){
            throw new Error (JSON.stringify({code: 401, msg: 'Token inválido' }))
        }
    } else {
        throw new Error (JSON.stringify({code: 401, msg: 'Token no proporcionado' }))
    }
}

module.exports = { generateToken, verifyToken };
