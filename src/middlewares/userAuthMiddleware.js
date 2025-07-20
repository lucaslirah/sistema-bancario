const { contas } = require('../database/database')

const userAuthMiddleware = (req, res, next) => {
    const password = req.headers['x-account-password']
    const accountNumber = req.body.accountNumber || req.query.accountNumber

    if (!accountNumber || !password) {
        return res.status(400).json({ mensagem: "Número da conta e senha são obrigatórios" })
    }

    const accountNumberInt = parseInt(accountNumber, 10)
    if (isNaN(accountNumberInt)) {
        return res.status(400).json({ mensagem: "Número de conta inválido" })
    }

    const account = contas.find(acc => acc.numero_conta === accountNumberInt)
    if (!account) {
        return res.status(404).json({ mensagem: "Conta não encontrada" })
    }

    if (password !== account.usuario.senha) {
        return res.status(403).json({ mensagem: "Senha incorreta" })
    }

    req.account = account
    next()
}

module.exports = userAuthMiddleware