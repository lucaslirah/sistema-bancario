const { contas } = require('../database/database')

const getAccountBalance = (req, res) => {
    const { accountNumber } = req.query
    const password = req.headers['x-account-password']

    // 1. Verificação de dados obrigatórios
    if (!accountNumber || !password) {
        return res.status(400).json({ mensagem: "Número da conta e senha são obrigatórios" })
    }

    // 2. Conversão segura do número
    const accountNumberInt = parseInt(accountNumber, 10)
    if (isNaN(accountNumberInt)) {
        return res.status(400).json({ mensagem: "Número de conta inválido" })
    }

    // 3. Busca da conta
    const account = contas.find(acc => acc.numero_conta === accountNumberInt)
    if (!account) {
        return res.status(404).json({ mensagem: "Conta não encontrada" })
    }

    // 4. Verificação da senha
    if (password !== account.usuario.senha) {
        return res.status(403).json({ mensagem: "Senha incorreta" })
    }

    // 5. Retorno do saldo
    return res.status(200).json({
        mensagem: "Consulta de saldo realizada com sucesso",
        saldo: account.saldo.toFixed(2)
    })
}

module.exports = {
    getAccountBalance
}