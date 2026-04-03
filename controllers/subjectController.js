const Subject = require('../models/Subject');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
const getSubjects = asyncHandler(async (req, res) => {
  const { department, semester } = req.query;
  
  let query = { isActive: true };
  
  if (department) {
    query.department = department;
  }
  
  if (semester) {
    query.semester = parseInt(semester);
  }

  const subjects = await Subject.find(query).sort('department semester');

  res.status(200).json({
    success: true,
    count: subjects.length,
    data: subjects
  });
});

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Public
const getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found'
    });
  }

  res.status(200).json({
    success: true,
    data: subject
  });
});

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private/Admin
const createSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.create(req.body);

  res.status(201).json({
    success: true,
    data: subject
  });
});

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!subject) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found'
    });
  }

  res.status(200).json({
    success: true,
    data: subject
  });
});

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!subject) {
    return res.status(404).json({
      success: false,
      message: 'Subject not found'
    });
  }

  // Soft delete by setting isActive to false
  subject.isActive = false;
  await subject.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get departments
// @route   GET /api/subjects/departments
// @access  Public
const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Subject.distinct('department', { isActive: true });

  res.status(200).json({
    success: true,
    data: departments
  });
});

module.exports = {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  getDepartments
};
