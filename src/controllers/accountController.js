// const { contas } = require('../database/database')
const connection = require('../database/connection')
const { findAccountByCpf, findAccountByEmail, isCpfInUse, isEmailInUse, validateRequiredFields } = require('../utils/validators')
const { generateAccountNumber, validateAccountNumber,  getAccountIndexByNumber} = require('../utils/accountUtils')
  
// função assíncrona para consultar banco de dados e retornar todas as contas
const listAccounts = async (req, res) => {
    try {
        const accounts = await connection('contas').select('*')
        return res.status(200).json(accounts)
    } catch (error) {
        console.error("Erro ao listar contas:", error)
        return res.status(500).json({ mensagem: "Erro interno do servidor ao listar contas." })
    }
}

const createAccount = async (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    //  1. Validação de campos obrigatórios
    const missingFields = validateRequiredFields({ nome, cpf, email })
    if (missingFields) return res.status(400).json({ mensagem: missingFields })

    try {
        //  2. Validações de CPF e E-mail únicos
    if (await findAccountByCpf(cpf)) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o CPF informado." })
    }
    if (await findAccountByEmail(email)) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o E-mail informado." })
    }

    //  3. Formatação e validação de telefone
    const formattedPhone = telefone.replace(/\D/g, '')
    if (formattedPhone.length !== 11) {
        return res.status(400).json({ mensagem: "Telefone precisa conter exatamente 11 dígitos." })
    }

    //  4. Geração do número da conta
    const accountNumber = await generateAccountNumber(formattedPhone)
    console.log("Número da conta gerado:", accountNumber)

    //  5. Criação da conta
    const [newAccount] = await connection('contas')
    .insert({
        numero_conta: accountNumber,
            nome,
            cpf,
            data_nascimento,
            telefone: formattedPhone,
            email,
            senha,
            saldo: 0
        }).returning('*')

    //  6. Resposta
    return res.status(201).json(
            { mensagem: "Conta criada com sucesso!", conta: newAccount }
        )
    } catch (error) {
        console.error("Erro ao criar conta:", error)
        return res.status(500).json(
                { mensagem: "Erro interno do servidor ao criar conta." }
            )
        }
    }

const deleteAccount = (req, res) => {
    const { accountNumber } = req.params
        
    let accountNumberInt, accountIndex, account

    try {
        // 1. Validação e conversão do número da conta
        accountNumberInt = validateAccountNumber(accountNumber)

        // 2. Localiza o índice da conta
        accountIndex = getAccountIndexByNumber(accountNumberInt, contas)
        account = contas[accountIndex]
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }

    // Validação de saldo
    if (account.saldo !== 0) {
        return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero." })
    }

    // Remoção direta no array original
    contas.splice(accountIndex, 1)

    //  Resposta
    return res.status(204).send()
}

const updateUser = (req, res) => {
  const { accountNumber } = req.params
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

  // 1. Validação de campos obrigatórios
  const missingFields = validateRequiredFields({ nome, cpf, data_nascimento, telefone, email, senha })
  if (missingFields) return res.status(400).json({ mensagem: missingFields })

  let accountNumberInt, accountIndex

  try {
    // 2. Conversão e busca da conta
    accountNumberInt = validateAccountNumber(accountNumber)
    accountIndex = getAccountIndexByNumber(accountNumberInt, contas)
  } catch (err) {
    return res.status(400).json({ mensagem: err.message })
  }

  // 3. Verificações de unicidade
  if (isCpfInUse(cpf, accountNumberInt)) {
    return res.status(400).json({ mensagem: "O CPF informado já está vinculado a outra conta" })
  }

  if (isEmailInUse(email, accountNumberInt)) {
    return res.status(400).json({ mensagem: "O E-mail informado já está vinculado a outra conta" })
  }

  // 4. Atualização dos dados
  contas[accountIndex].usuario = {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha
  }

  // 5. Retorno
  return res.status(201).json({
    mensagem: "Dados do usuário atualizados com sucesso!",
    usuario: contas[accountIndex].usuario
  })
}

module.exports = {
    listAccounts,
    createAccount,
    deleteAccount,
    updateUser
}