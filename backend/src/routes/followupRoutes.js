const express = require('express');
const router = express.Router();
const { createFollowUp, getLeadFollowUps } = require('../controllers/followUpController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', createFollowUp);
router.get('/lead/:leadId', getLeadFollowUps);

module.exports = router;
