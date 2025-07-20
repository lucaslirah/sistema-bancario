const { contas } = require("../database/database")

// Verifica se existe alguma conta com o CPF informado
const findAccountByCpf = (cpf) => {
    return contas.find(account => account.usuario.cpf === cpf)
}

// Verifica se existe alguma conta com o e-mail informado
const findAccountByEmail = (email) => {
    return contas.find(account => account.usuario.email === email)
}

// Verifica se o CPF já está em uso por outra conta
const isCpfInUse = (cpf, currentAccountNumber) => {
    return contas.find(account => 
        account.usuario.cpf === cpf && account.numero_conta !== currentAccountNumber
    )
}

// Verifica se o e-mail já está em uso por outra conta
const isEmailInUse = (email, currentAccountNumber) => {
    return contas.find(account => 
        account.usuario.email === email && account.numero_conta !== currentAccountNumber
    )
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