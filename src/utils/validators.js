const { contas } = require("../database/database")

const findAccountByCpf = (cpf) => {
    return contas.find(account => account.usuario.cpf === cpf);
}

const findAccountByEmail = (email) => {
    return contas.find(account => account.usuario.email === email);
}

module.exports = {
    findAccountByCpf,
    findAccountByEmail,
}