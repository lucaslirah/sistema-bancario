let { contas, saques, depositos, transferenciasEnviadas, transferenciasRecebidas } = require('../bancodedados')
const { buscarCpf, buscarEmail, gerarNumeroConta } = require('../controladores/funcoes')
const { format } = require('date-fns')

const listarContas = (req, res) => {
    return res.status(200).json(contas)
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    //  1. Validação de campos obrigatórios
    const camposObrigatorios = { nome, cpf, data_nascimento, telefone, email, senha }
    for (const campo in camposObrigatorios) {
        if (!camposObrigatorios[campo]) {
            return res.status(400).json({
                mensagem: `O campo '${campo}' é obrigatório.`
            })
        }
    }

    //  2. Validações de CPF e E-mail únicos
    if (buscarCpf(cpf)) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o CPF informado." })
    }

    if (buscarEmail(email)) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o E-mail informado." })
    }

    //  3. Formatação e validação de telefone
    const telefoneFormatado = telefone.replace(/\D/g, '')
    if (telefoneFormatado.length !== 11) {
        return res.status(400).json({ mensagem: "Telefone precisa conter exatamente 11 dígitos." })
    }

    //  4. Geração do número da conta (com tratamento de erro)
    let numeroConta
    try {
        numeroConta = gerarNumeroConta(telefoneFormatado)
    } catch (erro) {
        return res.status(400).json({ mensagem: erro.message })
    }

    //  5. Criação da conta
    const novaConta = {
        numero_conta: Number(numeroConta),
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone: telefoneFormatado,
            email,
            senha
        }
    }

    //  6. Persistência e resposta
    contas.push(novaConta)
    return res.status(201).json({ mensagem: "Conta criada com sucesso!", conta: novaConta })
}

const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (isNaN(numeroConta)) {
        return res.status(400).json({mensagem: "Número de conta inválido!"})
    }

    const indiceConta = contas.findIndex((conta) => {
        return conta.numero === Number(numeroConta)
    })

    if (indiceConta === -1) {
        return res.status(404).json({mensagem: "Conta não encontrada!"})
    }

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({mensagem: "Todos os campos são obrigatórios!"})
    }

    if (buscarCpf(cpf)) {
        return res.status(400).json({mensagem: "O CPF informado já existe cadastrado!"})
    }
    if (buscarEmail(email)) {
        return res.status(400).json({mensagem: "O E-mail informado já existe cadastrado!"})
    }

    // const indiceConta = contas.findIndex((conta) => {
    //     return conta.numero === Number(numeroConta)
    // })

    contas[indiceConta].usuario.nome = nome
    contas[indiceConta].usuario.cpf = cpf
    contas[indiceConta].usuario.data_nascimento = data_nascimento
    contas[indiceConta].usuario.telefone = telefone
    contas[indiceConta].usuario.email = email
    contas[indiceConta].usuario.senha = senha

    return res.status(201).json()
}

const deletarConta = (req, res) => {
    const { numeroConta } = req.params

    // Validação: número de conta
    const numeroContaInt = parseInt(numeroConta, 10)
    if (isNaN(numeroContaInt)) {
        return res.status(400).json({ mensagem: "Número de conta inválido." })
    }

    // Busca da conta
    const indiceConta = contas.findIndex(conta => conta.numero_conta === numeroContaInt)
    if (indiceConta === -1) {
        return res.status(404).json({ mensagem: "Conta não encontrada." })
    }

    const conta = contas[indiceConta]

    // Validação de saldo
    if (conta.saldo !== 0) {
        return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero." })
    }

    // Remoção direta no array original
    contas.splice(indiceConta, 1)

    //  Resposta
    return res.status(204).send()
}

// const depositarValor = (req, res) => {
//     const { numero_conta, valor } = req.body

//     if (!numero_conta || !valor) {
//         return res.status(400).json({mensagem: "O número da conta e o valor são obrigatórios!"})
//     }

//     const contaAchada = contas.find((conta) => {
//         return conta.numero === Number(numero_conta)
//     })

//     if (!contaAchada) {
//         return res.status(404).json({mensagem: "Conta não encontrada!"})
//     }

//     if (valor <= 0) {
//         return res.status(400).json({mensagem: "Valor de depósito inválido!"})
//     }

//     contaAchada.saldo += valor

//     const data = format(new Date(), 'yyyy-dd-MM-HH:mm:ss')

//     depositos.push({
//         data,
//         numero_conta,
//         valor
//     })
    
//     return res.status(204).json()

// }

const depositarValor = (req, res) => {
    const { numero_conta, valor } = req.body

    // 1. Validação de campos obrigatórios
    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios." })
    }

    // 2. Conversão de valores
    const numeroContaInt = parseInt(numero_conta, 10)
    const valorFloat = parseFloat(valor)

    // 3. Validação do valor
    if (isNaN(valorFloat) || valorFloat <= 0) {
        return res.status(400).json({ mensagem: "Valor de depósito inválido." })
    }

    // 4. Busca da conta
    const conta = contas.find(conta => conta.numero_conta === numeroContaInt)
    if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrada." })
    }

    // 5. Atualização do saldo
    conta.saldo += valorFloat

    // 6. Registro do depósito
    const data = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    depositos.push({
        data,
        numero_conta: numeroContaInt,
        valor: valorFloat
    })

    // 7. Resposta com confirmação
    return res.status(200).json({
        mensagem: "Depósito efetuado com sucesso.",
        valor_depositado: valorFloat.toFixed(2),
        saldo_atual: conta.saldo.toFixed(2)
    });

}

const sacarValor = (req, res) => {
    const { numero_conta, valor, senha } = req.body

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({mensagem: "Todos os campos são obrigatórios!"})
    }

    const contaAchada = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })

    if (!contaAchada) {
        return res.status(404).json({mensagem: "Conta não encontrada!"})
    }

    if (senha !== contaAchada.usuario.senha) {
        return res.status(403).json({mensagem: "Senha incorreta!"})
    }

    if (contaAchada.saldo === 0) {
        return res.status(400).json({mensagem: "A conta possui saldo zerado!"})
    }

    if (valor <= 0) {
        return res.status(400).json({mensagem: "Informe um valor de saque válido!"})
    }

    if (valor > contaAchada.saldo) {
        return res.status(400).json({mensagem: "Saldo insuficiente!"})
    }

    contaAchada.saldo -= valor

    const data = format(new Date(), 'yyyy-dd-MM-HH:mm:ss')

    saques.push({
        data,
        numero_conta,
        valor
    })

    return res.status(204).json()
}

const transferirValores = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({mensagem: "Todos os campos são obrigatórios!"})
    }

    if (numero_conta_origem === numero_conta_destino) {
        return res.status(400).json({mensagem: "Os números de conta são os mesmos!"})
    }

    const contaOrigemAchada = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem)
    })

    const contaDestinoAchada = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino)
    })

    if (!contaOrigemAchada) {
        return res.status(404).json({mensagem: "Conta de origem não encontrada!"})
    }

    if (!contaDestinoAchada) {
        return res.status(404).json({mensagem: "Conta de destino não encontrada!"})
    }

    if (senha !== contaOrigemAchada.usuario.senha) {
        return res.status(403).json({mensagem: "Senha incorreta!"})
    }

    if (contaOrigemAchada.saldo === 0) {
        return res.status(400).json({mensagem: "A conta possui saldo zerado!"})
    }

    if (valor <= 0) {
        return res.status(400).json({mensagem: "Informe um valor de saque válido!"})
    }

    if (valor > contaOrigemAchada.saldo) {
        return res.status(400).json({mensagem: "Saldo insuficiente!"})
    }

    contaOrigemAchada.saldo -= valor
    contaDestinoAchada.saldo += valor

    const data = format(new Date(), 'yyyy-dd-MM-HH:mm:ss')

    transferenciasEnviadas.push({
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor
    })

    transferenciasRecebidas.push({
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor
    })

    return res.status(204).json()
}

const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json({mensagem: "Número da conta e senha são obrigatórios!"})
    }

    const contaAchada = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })

    if (!contaAchada) {
        return res.status(404).json({mensagem: "Conta não encontrada!"})
    }

    if (senha !== contaAchada.usuario.senha) {
        return res.status(403).json({mensagem: "Senha incorreta!"})
    }

    return res.status(200).json({saldo: contaAchada.saldo})
}

const consultarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json({mensagem: "Número da conta e senha são obrigatórios!"})
    }

    const contaAchada = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })

    if (!contaAchada) {
        return res.status(404).json({mensagem: "Conta não encontrada!"})
    }

    if (senha !== contaAchada.usuario.senha) {
        return res.status(403).json({mensagem: "Senha incorreta!"})
    }

    const depositosConta = depositos.filter((deposito) => {
        return deposito.numero_conta === numero_conta
    })

    const saquesConta = saques.filter((saque) => {
        return saque.numero_conta === numero_conta
    })

    const transferenciasEnviadasConta = transferenciasEnviadas.filter((transferencias) => {
        return transferencias.numero_conta_origem === numero_conta
    })

    const transferenciasRecebidasConta = transferenciasRecebidas.filter((transferencias) => {
        return transferencias.numero_conta_destino === numero_conta
    })

    return res.status(201).json({
        depositos: depositosConta,
        saques: saquesConta,
        transferenciasEnviadas: transferenciasEnviadasConta,
        transferenciasRecebidas: transferenciasRecebidasConta
    })
}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    deletarConta,
    depositarValor,
    sacarValor,
    transferirValores,
    consultarSaldo,
    consultarExtrato
}