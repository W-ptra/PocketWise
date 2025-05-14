const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRED_TIME = process.env.JWT_EXPIRED_TIME || "1h";

function generateJwt(payload){
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRED_TIME });
}

function validateAndDecodeToken(token){
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

module.exports = {
    generateJwt,
    validateAndDecodeToken
}