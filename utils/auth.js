const jwt = require('jsonwebtoken');
secretKey = "secretOrPrivateKey must have a value"


function generateToken(user) {
    id = user[0]._id.toString()
    return jwt.sign({ id: id, username: user[0].username }, secretKey);
}

function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };
