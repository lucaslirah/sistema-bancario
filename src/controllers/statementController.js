

const consultarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query

    // 1. Validação de campos obrigatórios
    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "Número da conta e senha são obrigatórios." })
    }

    // 2. Conversão segura
    const numeroContaInt = parseInt(numero_conta, 10)

    // 3. Busca da conta
    const conta = contas.find(conta => conta.numero_conta === numeroContaInt)
    if (!conta) {
        return res.status(404).json({ mensagem: "Conta não encontrada." })
    }

    // 4. Validação de senha
    if (senha !== conta.usuario.senha) {
        return res.status(403).json({ mensagem: "Senha incorreta." })
    }

    // 5. Filtragem de movimentações
    const depositosConta = depositos.filter(deposito => deposito.numero_conta === numeroContaInt)
    const saquesConta = saques.filter(saque => saque.numero_conta === numeroContaInt)
    const transferenciasEnviadasConta = transferenciasEnviadas.filter(t => t.numero_conta_origem === numeroContaInt)
    const transferenciasRecebidasConta = transferenciasRecebidas.filter(t => t.numero_conta_destino === numeroContaInt)

    // 6. Resposta
    return res.status(200).json({
        mensagem: "Extrato da conta recuperado com sucesso.",
        saldo_atual: conta.saldo.toFixed(2),
        depositos: depositosConta,
        saques: saquesConta,
        transferencias_enviadas: transferenciasEnviadasConta,
        transferencias_recebidas: transferenciasRecebidasConta
    })
}