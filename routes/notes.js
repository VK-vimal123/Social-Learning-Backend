const express = require('express');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  downloadNote,
  getMyNotes,
  toggleLike
} = require('../controllers/noteController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(getNotes)
  .post(protect, createNote);

router.route('/my')
  .get(protect, getMyNotes);

router.route('/:id')
  .get(getNote)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

router.route('/:id/download')
  .get(protect, downloadNote);

router.route('/:id/like')
  .put(protect, toggleLike);

module.exports = router;
