// const { contas } = require("../database/database")
const connection = require("../database/connection")

// Função para gerar número da conta a partir do telefone
const generateAccountNumber = async (telefone) => {
  const AccountNumber = telefone

  // Validação: número precisa ter 11 dígitos numéricos
  if (!/^\d{11}$/.test(telefone)) {
    throw new Error("Número de telefone inválido para gerar conta.")
  }

  // Verifica se já existe esse número como conta em connection
  const ExistingAccount = await connection('contas')
  .where({ numero_conta: AccountNumber })
  .first()
  // contas.find(
  //   (account) => account.numero_conta === AccountNumber
  // )
  if (ExistingAccount) {
    throw new Error("Este número de telefone já está associado a uma conta.")
  }

  return AccountNumber
}

// Função para validar número da conta
const validateAccountNumber = (number) => {
    const int = parseInt(number, 10)
    if (isNaN(int)) throw new Error("Número de conta inválido.")
    return int.toString()
}

// Função para buscar número da conta
const getAccountIndexByNumber = (number, contas) => {
    const index = contas.findIndex(c => c.numero_conta === number)
    if (index === -1) throw new Error("Conta não encontrada.")
    return index
}

module.exports = {
    generateAccountNumber,
    validateAccountNumber,
    getAccountIndexByNumber
}