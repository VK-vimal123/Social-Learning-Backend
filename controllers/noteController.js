const Note = require('../models/Note');
const User = require('../models/User');
const Subject = require('../models/Subject');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
const getNotes = asyncHandler(async (req, res) => {
  let query = {};

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Note.find(JSON.parse(queryStr))
    .populate({
      path: 'uploadedBy',
      select: 'fullName username avatar'
    })
    .populate({
      path: 'subject',
      select: 'name code department'
    });

  // Search functionality
  if (req.query.search) {
    query = query.find({
      $text: { $search: req.query.search }
    });
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Note.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const notes = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: notes.length,
    pagination,
    data: notes
  });
});

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id)
    .populate({
      path: 'uploadedBy',
      select: 'fullName username avatar school branch stats'
    })
    .populate({
      path: 'subject',
      select: 'name code department'
    });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }

  // Increment view count
  note.stats.views += 1;
  await note.save();

  res.status(200).json({
    success: true,
    data: note
  });
});

// @desc    Create note
// @route   POST /api/notes
// @access  Private
const createNote = asyncHandler(async (req, res) => {
  // Add uploadedBy to req.body
  req.body.uploadedBy = req.user.id;

  // Check if subject exists
  const subject = await Subject.findById(req.body.subject);
  if (!subject) {
    return res.status(400).json({
      success: false,
      message: 'Invalid subject'
    });
  }

  const note = await Note.create(req.body);

  const populatedNote = await Note.findById(note._id)
    .populate({
      path: 'uploadedBy',
      select: 'fullName username avatar'
    })
    .populate({
      path: 'subject',
      select: 'name code department'
    });

  res.status(201).json({
    success: true,
    data: populatedNote
  });
});

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }

  // Check if user is note owner or admin
  if (note.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this note'
    });
  }

  // Update subject if provided
  if (req.body.subject) {
    const subject = await Subject.findById(req.body.subject);
    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject'
      });
    }
  }

  note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate({
    path: 'uploadedBy',
    select: 'fullName username avatar'
  }).populate({
    path: 'subject',
    select: 'name code department'
  });

  res.status(200).json({
    success: true,
    data: note
  });
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }

  // Check if user is note owner or admin
  if (note.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this note'
    });
  }

  await note.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Download note
// @route   GET /api/notes/:id/download
// @access  Private
const downloadNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }

  // Increment download count
  note.stats.downloads += 1;
  await note.save();

  // Update user's download stats
  await User.findByIdAndUpdate(
    req.user.id,
    { $inc: { 'stats.notesDownloaded': 1 } }
  );

  res.status(200).json({
    success: true,
    data: {
      downloadUrl: note.fileUrl,
      fileName: note.fileName
    }
  });
});

// @desc    Get my notes
// @route   GET /api/notes/my
// @access  Private
const getMyNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ uploadedBy: req.user.id })
    .populate({
      path: 'subject',
      select: 'name code department'
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes
  });
});

// @desc    Like/Unlike note
// @route   PUT /api/notes/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }

  const user = await User.findById(req.user.id);
  const isLiked = user.likedNotes && user.likedNotes.includes(note._id);

  if (isLiked) {
    // Unlike
    user.likedNotes = user.likedNotes.filter(id => id.toString() !== note._id.toString());
    note.stats.likes -= 1;
  } else {
    // Like
    if (!user.likedNotes) user.likedNotes = [];
    user.likedNotes.push(note._id);
    note.stats.likes += 1;
  }

  await user.save();
  await note.save();

  res.status(200).json({
    success: true,
    data: {
      liked: !isLiked,
      likes: note.stats.likes
    }
  });
});

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  downloadNote,
  getMyNotes,
  toggleLike
};
