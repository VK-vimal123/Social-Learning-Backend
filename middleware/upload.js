const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for notes - auto resource type for all files
const noteStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'social-learning-notes/notes',
    resource_type: 'auto',
    public_id: (req, file) => {
      const timestamp = Date.now();
      const cleanName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_');
      return `note_${timestamp}_${cleanName}`;
    }
  }
});

// Configure Cloudinary storage for avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'social-learning-notes/avatars',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    public_id: (req, file) => `avatar_${req.user.id}_${Date.now()}`
  }
});

// File filter for notes - accept common document types
const noteFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv'
  ];

  const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'];
  const ext = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    console.log('Rejected:', file.mimetype, file.originalname);
    cb(new Error(`File type not supported. Allowed: PDF, DOC, DOCX, TXT, CSV, XLS, XLSX, PPT, PPTX`), false);
  }
};

// File filter for avatars
const avatarFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Please upload an image file (JPG, PNG, GIF, WEBP)'), false);
  }
};

// Upload middleware for notes
const uploadNote = multer({
  storage: noteStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: noteFileFilter
});

// Upload middleware for avatars
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: avatarFileFilter
});

// Handle file upload errors
const handleUploadErrors = (err, req, res, next) => {
  console.log('Upload error details:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file allowed.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Please use "file" as the field name.'
      });
    }
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed'
    });
  }

  next();
};

module.exports = {
  uploadNote,
  uploadAvatar,
  handleUploadErrors,
  cloudinary
};
