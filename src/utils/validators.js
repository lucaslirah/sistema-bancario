// const { contas } = require("../database/database")
const connection = require("../database/connection")

// Verifica se existe alguma conta com o CPF informado
const findAccountByCpf = async (cpf) => {
    return await connection('contas').where({ cpf }).first()
    // return contas.find(account => account.usuario.cpf === cpf)
}

// Verifica se existe alguma conta com o e-mail informado
const findAccountByEmail = async (email) => {
    return await connection('contas').where({ email }).first()
    // return contas.find(account => account.usuario.email === email)
}

// Verifica se o CPF já está em uso por outra conta
const isCpfInUse = async (cpf, currentAccountNumber) => {
    return await connection('contas')
        .where({ cpf })
        .andWhereNot({ numero_conta: currentAccountNumber })
        .first()
    // return contas.find(account => account.usuario.cpf === cpf && account.numero_conta !== currentAccountNumber)
}

// Verifica se o e-mail já está em uso por outra conta
const isEmailInUse = async (email, currentAccountNumber) => {
    return await connection('contas')
        .where({ email })
        .andWhereNot({ numero_conta: currentAccountNumber })
        .first()
    // return contas.find(account => account.usuario.email === email && account.numero_conta !== currentAccountNumber)
}

// Valida os campos obrigatórios
const validateRequiredFields = (fields) => {
    for (const key in fields) {
        if (!fields[key]) {
            return `O campo '${key}' é obrigatório.`
        }
    }
    return null
}

module.exports = {
    findAccountByCpf,
    findAccountByEmail,
    isCpfInUse,
    isEmailInUse,
    validateRequiredFields
}