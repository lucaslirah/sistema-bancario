const { contas } = require('../bancodedados')

// let = ultimoNumero = 1

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

// module.exports = {
//     buscarCpf,
//     buscarEmail,
//     ultimoNumero
// }

// const { contas } = require('../bancodedados')

// Função para gerar número da conta a partir do telefone

const gerarNumeroConta = (telefone) => {
    const numeroConta = Number(telefone)

    // Validação: número precisa ter 11 dígitos numéricos
    if (!/^\d{11}$/.test(telefone)) {
        throw new Error('Número de telefone inválido para gerar conta.')
    }

    // Verifica se já existe esse número como conta
    const contaExistente = contas.find(conta => conta.numero_conta === numeroConta)
    if (contaExistente) {
        throw new Error('Este número de telefone já está associado a uma conta.')
    }

    return numeroConta;
}

// Exemplo de uso
// const novoNumeroConta = gerarNumeroConta('85 99888-1234'); // resultado: '1234'

/* // Funções de busca que você já tinha
const buscarCpf = (cpf) => {
    return contas.find((conta) => conta.usuario.cpf === cpf);
}

const buscarEmail = (email) => {
    return contas.find((conta) => conta.usuario.email === email);
} */

module.exports = {
    buscarCpf,
    buscarEmail,
    gerarNumeroConta
}