const jwt = require('jsonwebtoken')
const { secret } = require('../../config/auth.json')

module.exports = function (req, res, next) {
    try {
        const { headers: { authorization } } = req
        if (!authorization) return res.status(401).send({ erro: "Token não fornecido" })
    
        const split = authorization.split(' ')
        if (!split.length === 2) return res.status(401).send({ erro: "Token invalido" })
    
        const [scheme, token] = split
        if (!/^Bearer$/i.test(scheme)) { // '/' inicio da reger, ^ inicio da verificacao, Bearer palavra que esta buscando, $ fim da verificacao, i case insensitive 
            return res.status(401).send({ erro: "Token mal formatado" })
        }
    
        jwt.verify(token, secret, function (err, decoded) {
            if (err) return res.status(401).send({ erro: "Token incorreto" })
    
            req.userId = decoded.id
            return next()
        })    
    } catch (err) {
        console.log(err)
    }
    
}