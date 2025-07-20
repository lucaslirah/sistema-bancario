const { depositos, saques, transferenciasEnviadas, transferenciasRecebidas } = require('../database/database')

const getStatement = (req, res) => {
    const account = req.account
    const accountNumberInt = account.numero_conta

    // 1. Filtragem dos lançamentos
    const depositosConta = depositos.filter(dep => dep.numero_conta === accountNumberInt)
    const saquesConta = saques.filter(saq => saq.numero_conta === accountNumberInt)
    const transferenciasEnviadasConta = transferenciasEnviadas.filter(transf => transf.numero_conta_origem === accountNumberInt)
    const transferenciasRecebidasConta = transferenciasRecebidas.filter(transf => transf.numero_conta_destino === accountNumberInt)

    // 2. Resposta
    return res.status(200).json({
        mensagem: "Extrato da conta recuperado com sucesso",
        saldo_atual: account.saldo.toFixed(2),
        depositos: depositosConta,
        saques: saquesConta,
        transferencias_enviadas: transferenciasEnviadasConta,
        transferencias_recebidas: transferenciasRecebidasConta
    })
}

module.exports = {
    getStatement
}