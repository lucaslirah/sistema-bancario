const intermediario = (req, res, next) => {
    const { senha_banco } = req.query

    if(senha_banco) {
    senha_banco === "Cubos123Bank" ? next() : res.status(401).json({mensagem: "A senha do banco informada é inválida!"})
    } else {
        res.status(400).json({mensagem: "Senha necessária"})
    }

}

module.exports = intermediario