const express = require('express');
const router = express.Router();
const { getCounsellors, getCounsellorPerformance, deleteCounsellor } = require('../controllers/counsellorController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getCounsellors);
router.get('/performance', authorize('admin', 'manager', 'superadmin'), getCounsellorPerformance);
router.delete('/:id', authorize('admin', 'manager', 'superadmin'), deleteCounsellor);

module.exports = router;
