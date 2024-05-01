const jwt = require('jsonwebtoken');
const secretKey = 'thisIsASecretKEY'; 

function generateToken(user) {
    return jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };
