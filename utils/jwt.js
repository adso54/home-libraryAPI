const jwt = require('jwt-simple');
const UIDGenerator = require('uid-generator')
const uidgen = new UIDGenerator();

const tokenGenerate = (payload) => {
    const secret = uidgen.generateSync();
    return {
        token: jwt.encode(payload,secret),
        secret: secret
    }
}

const tokenDecode = (token, secret) => (
    jwt.decode(token, secret)
)

module.exports = {
    tokenGenerate: tokenGenerate, 
    tokenDecode: tokenDecode
}