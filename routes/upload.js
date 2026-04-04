const express = require('express');
const { protect } = require('../middleware/auth');
const { uploadNote, uploadAvatar, handleUploadErrors } = require('../middleware/upload');
const router = express.Router();

// Upload note file to Cloudinary
router.post('/note', protect, uploadNote.single('file'), handleUploadErrors, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('Uploaded file data:', req.file);

    // For raw files, Cloudinary returns path instead of secure_url
    const fileUrl = req.file.secure_url || req.file.path || req.file.url;
    const fileName = req.file.originalname || req.file.name;
    const fileSize = req.file.size || req.file.bytes || 0;
    const fileType = req.file.mimetype || req.file.format || req.file.resource_type || 'application/octet-stream';

    res.status(200).json({
      success: true,
      data: {
        secure_url: fileUrl,
        original_filename: fileName,
        bytes: fileSize,
        resource_type: req.file.resource_type || 'raw',
        format: req.file.format || fileName.split('.').pop(),
        fileType: fileType
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed'
    });
  }
});

// Upload avatar to Cloudinary
router.post('/avatar', protect, uploadAvatar.single('file'), handleUploadErrors, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        secure_url: req.file.secure_url,
        original_filename: req.file.originalname,
        bytes: req.file.size,
        resource_type: req.file.resource_type,
        format: req.file.format
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed'
    });
  }
});

module.exports = router;
