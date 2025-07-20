const { contas, depositos, saques, transferenciasEnviadas, transferenciasRecebidas } = require('../database/database')
const { format } = require('date-fns')

const deposit = (req, res) => {
    const { accountNumber, amount } = req.body

    // 1. Verificação de campos obrigatórios
    if (!accountNumber || !amount) {
        return res.status(400).json({ mensagem: "Número da conta e valor são obrigatórios" })
    }

    // 2. Conversão segura
    const accountNumberInt = parseInt(accountNumber, 10)
    const amountFloat = parseFloat(amount)

    // 3. Validação do valor
    if (isNaN(amountFloat) || amountFloat <= 0) {
        return res.status(400).json({ mensagem: "Valor de depósito inválido" })
    }

    // 4. Busca da conta
    const account = contas.find(acc => acc.numero_conta === accountNumberInt)
    if (!account) {
        return res.status(404).json({ mensagem: "Conta não encontrada" })
    }

    // 5. Atualização do saldo
    account.saldo += amountFloat

    // 6. Registro da operação
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    depositos.push({
        data: timestamp,
        numero_conta: accountNumberInt,
        valor: amountFloat
    })

    // 7. Retorno da API
    return res.status(200).json({
        mensagem: "Depósito efetuado com sucesso",
        valor_depositado: amountFloat.toFixed(2),
        saldo_atual: account.saldo.toFixed(2)
    })
}

const withdraw = (req, res) => {
    const { accountNumber, amount } = req.body
    const password = req.headers['x-account-password']

    // 1. Validação dos campos obrigatórios
    if (!accountNumber || !amount || !password) {
        return res.status(400).json({ mensagem: "Número da conta, valor e senha são obrigatórios" })
    }

    // 2. Conversões seguras
    const accountNumberInt = parseInt(accountNumber, 10)
    const amountFloat = parseFloat(amount)

    if (isNaN(accountNumberInt)) {
        return res.status(400).json({ mensagem: "Número de conta inválido" })
    }

    if (isNaN(amountFloat) || amountFloat <= 0) {
        return res.status(400).json({ mensagem: "Informe um valor de saque válido" })
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

    // 5. Verificação de saldo
    if (account.saldo === 0) {
        return res.status(400).json({ mensagem: "A conta possui saldo zerado" })
    }

    if (amountFloat > account.saldo) {
        return res.status(400).json({ mensagem: "Saldo insuficiente" })
    }

    // 6. Atualização do saldo
    account.saldo -= amountFloat

    // 7. Registro do saque
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    saques.push({
        data: timestamp,
        numero_conta: accountNumberInt,
        valor: amountFloat
    })

    // 8. Resposta da API
    return res.status(200).json({
        mensagem: "Saque realizado com sucesso",
        valor_sacado: amountFloat.toFixed(2),
        saldo_atual: account.saldo.toFixed(2)
    })
}

const transfer = (req, res) => {
    const { sourceAccount, destinationAccount, amount } = req.body
    const password = req.headers['x-account-password']

    // 1. Validação de campos obrigatórios
    if (!sourceAccount || !destinationAccount || !amount || !password) {
        return res.status(400).json({ mensagem: "Número das contas, valor e senha são obrigatórios" })
    }

    // 2. Conversões seguras
    const sourceInt = parseInt(sourceAccount, 10)
    const destInt = parseInt(destinationAccount, 10)
    const amountFloat = parseFloat(amount)

    if (isNaN(sourceInt) || isNaN(destInt)) {
        return res.status(400).json({ mensagem: "Número de conta inválido" })
    }

    if (isNaN(amountFloat) || amountFloat <= 0) {
        return res.status(400).json({ mensagem: "Informe um valor de transferência válido" })
    }

    // 3. Verificação de contas distintas
    if (sourceInt === destInt) {
        return res.status(400).json({ mensagem: "As contas de origem e destino devem ser diferentes" })
    }

    // 4. Busca de contas
    const originAccount = contas.find(acc => acc.numero_conta === sourceInt)
    const destinationAccountData = contas.find(acc => acc.numero_conta === destInt)

    if (!originAccount) {
        return res.status(404).json({ mensagem: "Conta de origem não encontrada" })
    }

    if (!destinationAccountData) {
        return res.status(404).json({ mensagem: "Conta de destino não encontrada" })
    }

    // 5. Validação de senha
    if (password !== originAccount.usuario.senha) {
        return res.status(403).json({ mensagem: "Senha incorreta" })
    }

    // 6. Verificação de saldo
    if (originAccount.saldo < amountFloat) {
        return res.status(400).json({ mensagem: "Saldo insuficiente" })
    }

    // 7. Atualização dos saldos
    originAccount.saldo -= amountFloat
    destinationAccountData.saldo += amountFloat

    // 8. Registro da transferência
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    transferenciasEnviadas.push({
        data: timestamp,
        numero_conta_origem: sourceInt,
        numero_conta_destino: destInt,
        valor: amountFloat
    })

    transferenciasRecebidas.push({
        data: timestamp,
        numero_conta_origem: sourceInt,
        numero_conta_destino: destInt,
        valor: amountFloat
    })

    // 9. Retorno da operação
    return res.status(200).json({
        mensagem: "Transferência realizada com sucesso",
        valor_transferido: amountFloat.toFixed(2),
        saldo_origem: originAccount.saldo.toFixed(2),
        saldo_destino: destinationAccountData.saldo.toFixed(2)
    })
}

module.exports = {
    deposit,
    withdraw, 
    transfer
}