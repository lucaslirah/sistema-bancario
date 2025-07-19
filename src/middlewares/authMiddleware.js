const authMiddleware = (req, res, next) => {
    const bankPassword = req.headers.authorization

    if (!bankPassword) {
        return res.status(400).json({ mensagem: "Cabeçalho de autorização obrigatório." })
    }

    if (bankPassword !== "Cubos123Bank") {
        return res.status(401).json({ mensagem: "Senha do banco inválida!" })
    }

    next()
}

module.exports = authMiddleware