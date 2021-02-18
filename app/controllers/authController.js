const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { secret } = require('../../config/auth.json')
const crypto = require('crypto')

const router = express.Router()

function gerarToken(params = {}) {
    return jwt.sign(params, secret, {
        expiresIn: 86400
    })
}

router.post('/autenticacao', async ({ body: { email, password } }, res) => {
    console.log({email})
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return res.status(400).send({ erro: 'Usuário nao encontrado' })
    }
    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({ erro: 'Senha incorreta' })
    }

    user.password = undefined

    res.send({ user, token: gerarToken({ id: user.id }) })
})

router.post('/cadastro', async ({ body: { email }, body }, res) => {
    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ erro: 'Email já cadastrado' })
        }
        const user = await User.create(body)

        user.password = undefined
        res.send({ user, token: gerarToken({ id: user.id }) })
    } catch (err) {
        return res.status(400).send({ erro: 'Erro no cadastro', Erro: err.message })
    }
})

router.post('/forgot_password', async (req, res) => {
    try {
        const { body: { email } } = req
        const user = await users.findOne({ email }) //||res.status(400).send({ body: 'email não encontrado' }))

        if (!user) {
            res.status(400)
        }

        const token = crypto.randomBytes(20).toString('hex')
        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

    } catch (err) {
        return res.status(400)
    }
})

router.post('/reset_password', async (req, res) => {
    try {
        const { body: { email } } = req
        const user = await users.findOne({ email }).select('+passwordResetToken passwordResetExpires')

        if (!user) return res.status(400).send({erro: 'usuario nao encontrado'})
        
        if (token !== user.passwordResetToken) return res.status(400).send({ erro: 'Token inválido' })
        const now = new Date()
        if (now > passwordResetExpires) return res.status(400).send({ erro: 'Token expirado' })
        
        user.password = password

        await user.save()
    } catch (err) {
        return res.status(400)
    }
})

module.exports = app => app.use('/auth', router)