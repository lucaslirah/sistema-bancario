// Valida se o valor recebido é numérico e maior que zero
const validateTransactionAmount = (amount) => {
  const amountFloat = parseFloat(amount)
  if (isNaN(amountFloat) || amountFloat <= 0) {
    throw new Error("Valor da transação inválido.")
  }
  return amountFloat
}

// Verifica se a conta possui saldo suficiente para realizar a operação
const hasSufficientBalance = (account, amount) => {
  if (account.saldo < amount) {
    throw new Error("Saldo insuficiente.")
  }
}

module.exports = {
  validateTransactionAmount,
  hasSufficientBalance
}