const express = require('express');
const {
  getNoteComments,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  reportComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/note/:noteId')
  .get(getNoteComments);

router.route('/')
  .post(protect, createComment);

router.route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

router.route('/:id/like')
  .put(protect, toggleCommentLike);

router.route('/:id/report')
  .post(protect, reportComment);

module.exports = router;
