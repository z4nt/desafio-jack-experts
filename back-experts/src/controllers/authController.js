const jwt = require('jsonwebtoken')
require('dotenv').config()
const Usuario = require('../models/usuarios')

const login = async (req, res) => {
    const dados = req.body
    const result = await Usuario.findOne({ where: { email: dados.email, password: dados.password } })
    if (result) {
        const token = jwt.sign(dados, process.env.JWT, { expiresIn: '1h' })
        console.log(token)
        res.json(token)
    } else {
        console.log('Deu ruim no login')
    }  

}

module.exports = { login }