const express = require('express');
const router = express.Router();
const walletController = require ('../controllers/walletController.js');

router.get('/',walletController.getWallets);
router.post('/',walletController.createWallet);
router.put('/:id',walletController.updateWallet);
router.delete('/:id',walletController.deleteWallet);

module.exports = router;