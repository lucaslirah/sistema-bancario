const express = require('express')
const router = express.Router()

// Controllers
const accountController = require('../controllers/accountController')
const transactionController = require('../controllers/transactionController')
const statementController = require('../controllers/statementController')
const balanceController = require('../controllers/balanceController')

// Middleware
const authMiddleware = require('../middlewares/authMiddleware')
const userAuthMiddleware = require('../middlewares/userAuthMiddleware')

// Account Routes
router.get('/accounts', authMiddleware, accountController.listAccounts)
router.post('/accounts', authMiddleware, accountController.createAccount)
router.put('/accounts/:numero_conta/user', authMiddleware, accountController.updateUser)
router.delete('/accounts/:accountNumber', authMiddleware, accountController.deleteAccount)

// Transactions
router.post('/transactions/deposit', authMiddleware, transactionController.deposit)
router.post('/transactions/withdraw', authMiddleware, userAuthMiddleware, transactionController.withdraw)
router.post('/transactions/transfer', authMiddleware, userAuthMiddleware, transactionController.transfer)

// Balance & Statement
router.get('/accounts/balance', authMiddleware, userAuthMiddleware, balanceController.getAccountBalance)
router.get('/accounts/statement', authMiddleware, userAuthMiddleware, statementController.getStatement)

module.exports = router