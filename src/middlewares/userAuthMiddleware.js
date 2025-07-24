const connection = require('../database/connection')
const { validateAccountNumber } = require('../utils/accountUtils')

/**
 * Middleware que valida autenticação do usuário por número da conta e senha.
 * - Extrai dados dos headers e body/query
 * - Valida presença e formato
 * - Busca a conta no banco
 * - Compara senha
 */
const userAuthMiddleware = async (req, res, next) => {
  // 1. Extrai senha do cabeçalho e número da conta do body ou query
  const password = req.headers['x-account-password']
  const accountNumber = req.body.accountNumber || req.query.accountNumber

  if (!accountNumber || !password) {
    return res.status(400).json({ mensagem: "Número da conta e senha são obrigatórios" })
  }

  let accountNumberInt
  try {
    accountNumberInt = validateAccountNumber(accountNumber)
  } catch (error) {
    return res.status(400).json({ mensagem: "Número de conta inválido" })
  }

  try {
    // 2. Busca a conta no banco via Knex
    const account = await connection('contas')
      .where({ numero_conta: accountNumberInt })
      .first()

    if (!account) {
      return res.status(404).json({ mensagem: "Conta não encontrada" })
    }

    // 3. Valida a senha recebida
    if (password !== account.senha) {
      return res.status(403).json({ mensagem: "Senha incorreta" })
    }

    // 4. Anexa conta à requisição e segue
    req.account = account
    next()

  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensagem: "Erro ao autenticar usuário" })
  }
}

module.exports = userAuthMiddleware