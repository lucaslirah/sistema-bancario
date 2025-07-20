const { contas, depositos, saques } = require('../database/database')
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

const transferirValores = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    // 1. Validação de campos obrigatórios
    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." })
    }

    // 2. Conversão de tipos
    const contaOrigemInt = parseInt(numero_conta_origem, 10)
    const contaDestinoInt = parseInt(numero_conta_destino, 10)
    const valorFloat = parseFloat(valor)

    // 3. Validação de contas diferentes
    if (contaOrigemInt === contaDestinoInt) {
        return res.status(400).json({ mensagem: "Os números de conta são os mesmos." })
    }

    // 4. Busca de contas
    const contaOrigem = contas.find(conta => conta.numero_conta === contaOrigemInt)
    const contaDestino = contas.find(conta => conta.numero_conta === contaDestinoInt)

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: "Conta de origem não encontrada." })
    }

    if (!contaDestino) {
        return res.status(404).json({ mensagem: "Conta de destino não encontrada." })
    }

    // 5. Validação de senha
    if (senha !== contaOrigem.usuario.senha) {
        return res.status(403).json({ mensagem: "Senha incorreta." })
    }

    // 6. Validações de saldo e valor
    if (isNaN(valorFloat) || valorFloat <= 0) {
        return res.status(400).json({ mensagem: "Informe um valor de transferência válido." })
    }

    if (valorFloat > contaOrigem.saldo) {
        return res.status(400).json({ mensagem: "Saldo insuficiente." })
    }

    // 7. Atualização dos saldos
    contaOrigem.saldo -= valorFloat
    contaDestino.saldo += valorFloat

    // 8. Registro da transferência
    const data = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    transferenciasEnviadas.push({
        data,
        numero_conta_origem: contaOrigemInt,
        numero_conta_destino: contaDestinoInt,
        valor: valorFloat
    })

    transferenciasRecebidas.push({
        data,
        numero_conta_origem: contaOrigemInt,
        numero_conta_destino: contaDestinoInt,
        valor: valorFloat
    })

    // 9. Resposta com dados da operação
    return res.status(200).json({
        mensagem: "Transferência realizada com sucesso.",
        valor_transferido: valorFloat.toFixed(2),
        saldo_origem: contaOrigem.saldo.toFixed(2),
        saldo_destino: contaDestino.saldo.toFixed(2)
    })
}

module.exports = {
    deposit,
    withdraw
}