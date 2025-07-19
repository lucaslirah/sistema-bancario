const authMiddleware = (req, res, next) => {
    const { bank_password } = req.query

    if (!bank_password) {
        return res.status(400).json({ mensagem: "Senha necessária." })
    }

    if (bank_password !== "Cubos123Bank") {
        return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" })
    }

    next()
}

module.exports = authMiddleware