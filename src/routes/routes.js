const express = require('express')
const router = express.Router()

// Controllers
const accountController = require('../controllers/accountController')
const transactionController = require('../controllers/transactionController')
const statementController = require('../controllers/statementController')
const balanceController = require('../controllers/balanceController')

// Middleware
const authMiddleware = require('../middlewares/authMiddleware')

// Account Routes
router.get('/accounts', authMiddleware, accountController.listAccounts)
router.post('/accounts', authMiddleware, accountController.createAccount)
router.put('/accounts/:accountNumber/user', authMiddleware, accountController.updateUser)
router.delete('/accounts/:accountNumber', authMiddleware, accountController.deleteAccount)

// Transactions
router.post('/transactions/deposit', authMiddleware, transactionController.deposit)
router.post('/transactions/withdraw', authMiddleware, transactionController.withdraw)
// router.post('/transactions/transfer', transactionController.transfer)

// Balance & Statement
router.get('/accounts/balance', balanceController.getAccountBalance)
// router.get('/accounts/statement', statementController.getStatement)

module.exports = router