const getAccountBalance = (req, res) => {
    const account = req.account

    return res.status(200).json({
        mensagem: "Consulta de saldo realizada com sucesso",
        saldo: account.saldo.toFixed(2)
    })
}

module.exports = {
    getAccountBalance
}