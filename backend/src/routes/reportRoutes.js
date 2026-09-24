const express = require('express');
const router = express.Router();
const { getAnalyticsSummary } = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/summary', getAnalyticsSummary);

module.exports = router;
