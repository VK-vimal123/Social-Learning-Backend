const Rating = require('../models/Rating');
const Note = require('../models/Note');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get ratings for a note
// @route   GET /api/ratings/note/:noteId
// @access  Public
const getNoteRatings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const ratings = await Rating.find({ note: req.params.noteId })
    .populate({
      path: 'user',
      select: 'fullName username avatar'
    })
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Rating.countDocuments({ note: req.params.noteId });

  res.status(200).json({
    success: true,
    count: ratings.length,
    total,
    pages: Math.ceil(total / limit),
    data: ratings
  });
});

// @desc    Create or update rating
// @route   POST /api/ratings
// @access  Private
const createRating = asyncHandler(async (req, res) => {
  const { noteId, rating, review } = req.body;

  // Check if note exists
  const note = await Note.findById(noteId);
  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }

  // Check if user is not rating their own note
  if (note.uploadedBy.toString() === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot rate your own note'
    });
  }

  // Check if rating already exists
  const existingRating = await Rating.findOne({
    note: noteId,
    user: req.user.id
  });

  let ratingDoc;
  if (existingRating) {
    // Update existing rating
    existingRating.rating = rating;
    existingRating.review = review;
    ratingDoc = await existingRating.save();
  } else {
    // Create new rating
    ratingDoc = await Rating.create({
      note: noteId,
      user: req.user.id,
      rating,
      review
    });
  }

  const populatedRating = await Rating.findById(ratingDoc._id)
    .populate({
      path: 'user',
      select: 'fullName username avatar'
    });

  res.status(existingRating ? 200 : 201).json({
    success: true,
    data: populatedRating
  });
});

// @desc    Delete rating
// @route   DELETE /api/ratings/:id
// @access  Private
const deleteRating = asyncHandler(async (req, res) => {
  const rating = await Rating.findById(req.params.id);

  if (!rating) {
    return res.status(404).json({
      success: false,
      message: 'Rating not found'
    });
  }

  // Check if user owns the rating
  if (rating.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this rating'
    });
  }

  await rating.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user's ratings
// @route   GET /api/ratings/my
// @access  Private
const getMyRatings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const ratings = await Rating.find({ user: req.user.id })
    .populate({
      path: 'note',
      select: 'title subject uploadedBy createdAt'
    })
    .sort('-createdAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Rating.countDocuments({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: ratings.length,
    total,
    pages: Math.ceil(total / limit),
    data: ratings
  });
});

module.exports = {
  getNoteRatings,
  createRating,
  deleteRating,
  getMyRatings
};
