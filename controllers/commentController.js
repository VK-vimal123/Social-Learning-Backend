const Comment = require('../models/Comment');
const Note = require('../models/Note');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get comments for a note
// @route   GET /api/comments/note/:noteId
// @access  Public
const getNoteComments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const comments = await Comment.find({ 
    note: req.params.noteId,
    parentComment: null,
    isDeleted: false
  })
    .populate({
      path: 'user',
      select: 'fullName username avatar'
    })
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Comment.countDocuments({ 
    note: req.params.noteId,
    parentComment: null,
    isDeleted: false
  });

  res.status(200).json({
    success: true,
    count: comments.length,
    total,
    pages: Math.ceil(total / limit),
    data: comments
  });
});

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { noteId, content, parentComment } = req.body;

  // Check if note exists
  const note = await Note.findById(noteId);
  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }

  // If it's a reply, check if parent comment exists
  if (parentComment) {
    const parent = await Comment.findById(parentComment);
    if (!parent || parent.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Parent comment not found'
      });
    }
  }

  const comment = await Comment.create({
    note: noteId,
    user: req.user.id,
    content,
    parentComment: parentComment || null
  });

  const populatedComment = await Comment.findById(comment._id)
    .populate({
      path: 'user',
      select: 'fullName username avatar'
    });

  res.status(201).json({
    success: true,
    data: populatedComment
  });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  let comment = await Comment.findById(req.params.id);

  if (!comment || comment.isDeleted) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // Check if user owns the comment
  if (comment.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this comment'
    });
  }

  comment.content = content;
  comment.isEdited = true;
  comment.lastModified = Date.now();

  await comment.save();

  const populatedComment = await Comment.findById(comment._id)
    .populate({
      path: 'user',
      select: 'fullName username avatar'
    });

  res.status(200).json({
    success: true,
    data: populatedComment
  });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment || comment.isDeleted) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // Check if user owns the comment or is admin
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this comment'
    });
  }

  // Soft delete
  comment.isDeleted = true;
  await comment.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Like/Unlike comment
// @route   PUT /api/comments/:id/like
// @access  Private
const toggleCommentLike = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment || comment.isDeleted) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  const isLiked = comment.likes.some(like => 
    like.user.toString() === req.user.id
  );

  if (isLiked) {
    // Unlike
    comment.likes = comment.likes.filter(like => 
      like.user.toString() !== req.user.id
    );
  } else {
    // Like
    comment.likes.push({ user: req.user.id });
  }

  await comment.save();

  res.status(200).json({
    success: true,
    data: {
      liked: !isLiked,
      likes: comment.likes.length
    }
  });
});

// @desc    Report comment
// @route   POST /api/comments/:id/report
// @access  Private
const reportComment = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a reason for reporting'
    });
  }

  const comment = await Comment.findById(req.params.id);

  if (!comment || comment.isDeleted) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // Check if already reported by this user
  const alreadyReported = comment.reportedBy.some(report => 
    report.user.toString() === req.user.id
  );

  if (alreadyReported) {
    return res.status(400).json({
      success: false,
      message: 'You have already reported this comment'
    });
  }

  comment.reportedBy.push({
    user: req.user.id,
    reason
  });

  await comment.save();

  res.status(200).json({
    success: true,
    message: 'Comment reported successfully'
  });
});

module.exports = {
  getNoteComments,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  reportComment
};
