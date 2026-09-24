const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  assignLead,
  deleteLead
} = require('../controllers/leadController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/', getLeads);
router.post('/', createLead);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.post('/assign', authorize('admin', 'manager'), assignLead);
router.delete('/:id', authorize('admin', 'manager'), deleteLead);

module.exports = router;
