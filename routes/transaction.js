const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/',transactionController.createTransaction);
router.get('/:walletId', transactionController.getTransactionsByWallet);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);
router.get('/', transactionController.getTransactionsByUser); 

module.exports = router;