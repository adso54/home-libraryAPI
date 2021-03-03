var jwt = require('jwt-simple');

const tokenGenerate = (payload) => (
    jwt.encode(payload, process.env.JWT_SECRET)
)

const tokenDecode = (token) => (
    jwt.decode(token, process.env.JWT_SECRET)
)

module.exports = {
    tokenGenerate: tokenGenerate, 
    tokenDecode: tokenDecode
}