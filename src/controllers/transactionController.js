const { contas, depositos, saques, transferenciasEnviadas, transferenciasRecebidas } = require('../database/database')
const { format } = require('date-fns')

const { validateAccountNumber } = require('../utils/accountUtils')

const { validateTransactionAmount, hasSufficientBalance } = require('../utils/transactionUtils')

const deposit = (req, res) => {
  // 1. Captura e validação dos dados recebidos no corpo da requisição
  const { accountNumber, amount } = req.body

  try {
    const accountNumberInt = validateAccountNumber(accountNumber)
    const amountFloat = validateTransactionAmount(amount)

    // 2. Busca da conta de destino no banco de dados (array contas)
    const account = contas.find(acc => acc.numero_conta === accountNumberInt)
    if (!account) {
      return res.status(404).json({ mensagem: "Conta não encontrada." })
    }

    // 3. Atualização do saldo
    account.saldo += amountFloat

    // 4. Registro da operação no extrato de depósitos
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    depositos.push({
      data: timestamp,
      numero_conta: accountNumberInt,
      valor: amountFloat
    })

    // 5. Retorno para o cliente com valor e saldo atual formatado
    return res.status(200).json({
      mensagem: "Depósito efetuado com sucesso.",
      valor_depositado: amountFloat.toFixed(2),
      saldo_atual: account.saldo.toFixed(2)
    })
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

const withdraw = (req, res) => {
  // 1. A conta já está disponível via userAuthMiddleware
  const account = req.account
  const { amount } = req.body

  try {
    const amountFloat = validateTransactionAmount(amount)

    // 2. Verificação de saldo suficiente
    hasSufficientBalance(account, amountFloat)

    // 3. Atualização do saldo após o saque
    account.saldo -= amountFloat

    // 4. Registro da operação no extrato de saques
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    saques.push({
      data: timestamp,
      numero_conta: account.numero_conta,
      valor: amountFloat
    })

    // 5. Retorno da confirmação
    return res.status(200).json({
      mensagem: "Saque realizado com sucesso.",
      valor_sacado: amountFloat.toFixed(2),
      saldo_atual: account.saldo.toFixed(2)
    })
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

const transfer = (req, res) => {
  // 1. Conta de origem está disponível via userAuthMiddleware
  const originAccount = req.account
  const { destinationAccount, amount } = req.body

  try {
    const destinationAccountInt = validateAccountNumber(destinationAccount)
    const amountFloat = validateTransactionAmount(amount)

    // 2. Verificação para evitar transferência entre mesma conta
    if (originAccount.numero_conta === destinationAccountInt) {
      return res.status(400).json({ mensagem: "A conta de origem e destino devem ser diferentes." })
    }

    // 3. Busca da conta de destino no banco de dados (array contas)
    const destinationAccountData = contas.find(acc => acc.numero_conta === destinationAccountInt)
    if (!destinationAccountData) {
      return res.status(404).json({ mensagem: "Conta de destino não encontrada." })
    }

    // 4. Verificação de saldo suficiente
    hasSufficientBalance(originAccount, amountFloat)

    // 5. Atualização de saldos nas duas contas
    originAccount.saldo -= amountFloat
    destinationAccountData.saldo += amountFloat

    // 6. Registro da operação no extrato de transferências
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    const transfer = {
      data: timestamp,
      numero_conta_origem: originAccount.numero_conta,
      numero_conta_destino: destinationAccountInt,
      valor: amountFloat
    }

    transferenciasEnviadas.push(transfer)
    transferenciasRecebidas.push(transfer)

    // 7. Retorno da operação realizada
    return res.status(200).json({
      mensagem: "Transferência realizada com sucesso.",
      valor_transferido: amountFloat.toFixed(2),
      saldo_origem: originAccount.saldo.toFixed(2),
      saldo_destino: destinationAccountData.saldo.toFixed(2)
    })
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

module.exports = {
  deposit,
  withdraw,
  transfer
}