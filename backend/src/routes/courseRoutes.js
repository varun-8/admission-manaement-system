const express = require('express');
const router = express.Router();
const { getCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/', getCourses);
router.post('/', protect, authorize('admin', 'manager', 'superadmin'), createCourse);
router.put('/:id', protect, authorize('admin', 'manager', 'superadmin'), updateCourse);
router.delete('/:id', protect, authorize('admin', 'manager', 'superadmin'), deleteCourse);

module.exports = router;
