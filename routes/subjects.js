const express = require('express');
const {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  getDepartments
} = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(getSubjects)
  .post(protect, authorize('admin'), createSubject);

router.route('/departments')
  .get(getDepartments);

router.route('/:id')
  .get(getSubject)
  .put(protect, authorize('admin'), updateSubject)
  .delete(protect, authorize('admin'), deleteSubject);

module.exports = router;
