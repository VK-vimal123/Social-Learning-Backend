const express = require('express');
const {
  getNoteRatings,
  createRating,
  deleteRating,
  getMyRatings
} = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/note/:noteId')
  .get(getNoteRatings);

router.route('/my')
  .get(protect, getMyRatings);

router.route('/')
  .post(protect, createRating);

router.route('/:id')
  .delete(protect, deleteRating);

module.exports = router;
