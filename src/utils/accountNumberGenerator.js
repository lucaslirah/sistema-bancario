const { contas } = require("../database/database")

// Função para gerar número da conta a partir do telefone
const generateAccountNumber = (telefone) => {
  const AccountNumber = Number(telefone)

  // Validação: número precisa ter 11 dígitos numéricos
  if (!/^\d{11}$/.test(telefone)) {
    throw new Error("Número de telefone inválido para gerar conta.")
  }

  // Verifica se já existe esse número como conta
  const ExistingAccount = contas.find(
    (account) => account.numero_conta === AccountNumber
  )
  if (ExistingAccount) {
    throw new Error("Este número de telefone já está associado a uma conta.")
  }

  return AccountNumber
}

module.exports = {
    generateAccountNumber
}