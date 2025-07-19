const { contas } = require('../database/database')
const { findAccountByCpf, findAccountByEmail } = require('../utils/validators')
const { generateAccountNumber } = require('../utils/accountNumberGenerator')

const listAccounts = (req, res) => {
    return res.status(200).json(contas)
}

const createAccount = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    //  1. Validação de campos obrigatórios
    const requiredFields = { nome, cpf, data_nascimento, telefone, email, senha }
    for (const field in requiredFields) {
        if (!requiredFields[field]) {
            return res.status(400).json({
                mensagem: `O campo '${field}' é obrigatório.`
            })
        }
    }

    //  2. Validações de CPF e E-mail únicos
    if (findAccountByCpf(cpf)) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o CPF informado." })
    }

    if (findAccountByEmail(email)) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o E-mail informado." })
    }

    //  3. Formatação e validação de telefone
    const formattedPhone = telefone.replace(/\D/g, '')
    if (formattedPhone.length !== 11) {
        return res.status(400).json({ mensagem: "Telefone precisa conter exatamente 11 dígitos." })
    }

    //  4. Geração do número da conta (com tratamento de erro)
    let accountNumber
    try {
        accountNumber = generateAccountNumber(formattedPhone)
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }

    //  5. Criação da conta
    const newAccount = {
        numero_conta: Number(accountNumber),
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone: formattedPhone,
            email,
            senha
        }
    }

    //  6. Persistência e resposta
    contas.push(newAccount)
    return res.status(201).json({ mensagem: "Conta criada com sucesso!", conta: newAccount })
}

const deleteAccount = (req, res) => {
    const { accountNumber } = req.params

    // Validação: número de conta
    const accountNumberInt = parseInt(accountNumber, 10)
    if (isNaN(accountNumberInt)) {
        return res.status(400).json({ mensagem: "Número de conta inválido." })
    }

    // Busca da conta
    const accountIndex = contas.findIndex(conta => conta.numero_conta === accountNumberInt)
    if (accountIndex === -1) {
        return res.status(404).json({ mensagem: "Conta não encontrada." })
    }

    const account = contas[accountIndex]

    // Validação de saldo
    if (account.saldo !== 0) {
        return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero." })
    }

    // Remoção direta no array original
    contas.splice(accountIndex, 1)

    //  Resposta
    return res.status(204).send()
}

const atualizarUsuario = (req, res) => {
    const { accountNumber } = req.params
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (isNaN(accountNumber)) {
        return res.status(400).json({mensagem: "Número de conta inválido!"})
    }

    const accountIndex = contas.findIndex((conta) => {
        return conta.numero === Number(accountNumber)
    })

    if (accountIndex === -1) {
        return res.status(404).json({mensagem: "Conta não encontrada!"})
    }

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({mensagem: "Todos os campos são obrigatórios!"})
    }

    if (findAccountByCpf(cpf)) {
        return res.status(400).json({mensagem: "O CPF informado já existe cadastrado!"})
    }
    if (findAccountByEmail(email)) {
        return res.status(400).json({mensagem: "O E-mail informado já existe cadastrado!"})
    }

    // const accountIndex = contas.findIndex((conta) => {
    //     return conta.numero === Number(accountNumber)
    // })

    contas[accountIndex].usuario.nome = nome
    contas[accountIndex].usuario.cpf = cpf
    contas[accountIndex].usuario.data_nascimento = data_nascimento
    contas[accountIndex].usuario.telefone = telefone
    contas[accountIndex].usuario.email = email
    contas[accountIndex].usuario.senha = senha

    return res.status(201).json()
}

module.exports = {
    listAccounts,
    createAccount,
    deleteAccount
};