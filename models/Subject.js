const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a subject name'],
    trim: true,
    maxlength: [50, 'Subject name cannot be more than 50 characters']
  },
  code: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true,
    required: [true, 'Please provide a subject code']
  },
  department: {
    type: String,
    required: [true, 'Please specify a department'],
    enum: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Electronics', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'General']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  credits: {
    type: Number,
    min: 1,
    max: 10
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalNotes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

SubjectSchema.index({ code: 1 });
SubjectSchema.index({ department: 1, semester: 1 });

module.exports = mongoose.model('Subject', SubjectSchema);
