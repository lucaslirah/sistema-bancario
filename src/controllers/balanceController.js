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