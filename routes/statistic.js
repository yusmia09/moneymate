const express = require('express');
const router = express.Router();
const statisticController = require('../controllers/statisticController');

router.get('/wallet/:walletId/statistics', statisticController.getStatistics);

module.exports = router;