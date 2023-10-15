const { contas } = require('../bancodedados')

let = ultimoNumero = 1

const buscarCpf = (cpf) => {

    const buscarCpf = contas.find((conta) => {
        return conta.usuario.cpf === cpf
    })

    return buscarCpf
}

const buscarEmail = (email) => {

    const buscarEmail = contas.find((conta) => {
        return conta.usuario.email === email
    })

    return buscarEmail
}

module.exports = {
    buscarCpf,
    buscarEmail,
    ultimoNumero
}