const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for your note'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Please specify a subject']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Note must be uploaded by a user']
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide a file URL']
  },
  fileName: {
    type: String,
    required: [true, 'Please provide a file name']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  year: {
    type: Number,
    min: 1,
    max: 4
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  },
  thumbnailUrl: {
    type: String
  },
  pageCount: {
    type: Number
  },
  language: {
    type: String,
    default: 'english'
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  reportedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      required: true
    },
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search functionality
NoteSchema.index({ title: 'text', description: 'text', tags: 'text' });
NoteSchema.index({ subject: 1, createdAt: -1 });
NoteSchema.index({ uploadedBy: 1, createdAt: -1 });
NoteSchema.index({ 'stats.averageRating': -1 });
NoteSchema.index({ 'stats.downloads': -1 });

// Update user stats when note is created
NoteSchema.post('save', async function() {
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(
    this.uploadedBy,
    { $inc: { 'stats.notesUploaded': 1 } }
  );
});

// Update user stats when note is deleted
NoteSchema.post('remove', async function() {
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(
    this.uploadedBy,
    { $inc: { 'stats.notesUploaded': -1 } }
  );
});

module.exports = mongoose.model('Note', NoteSchema);
