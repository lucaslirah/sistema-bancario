const express = require('express')
const rotas = express()
const controladores = require('./controladores/controlador')
const intermediario = require('./intermediarios/intermediario')

rotas.get('/contas', intermediario, controladores.listarContas)
rotas.post('/contas', controladores.criarConta)
rotas.put('/contas/:numeroConta/usuario', controladores.atualizarUsuario)
rotas.delete('/contas/:numeroConta', controladores.deletarConta)
rotas.post('/transacoes/depositar', controladores.depositarValor)
rotas.post('/transacoes/sacar', controladores.sacarValor)
rotas.post('/transacoes/transferir', controladores.transferirValores)
rotas.get('/contas/saldo', controladores.consultarSaldo)
rotas.get('/contas/extrato', controladores.consultarExtrato)

module.exports = rotas