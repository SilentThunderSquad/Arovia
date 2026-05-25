'use strict';

const multer = require('multer');

/**
 * Upload middleware — uses memory storage so files are accessible
 * as Buffer via req.files. Compatible with Vercel (no disk writes).
 * Files are forwarded to Supabase Storage by the relevant controller.
 */
const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: JPEG, PNG, WEBP, GIF, PDF'), false);
  }
};

const upload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
});

/**
 * For profile + prescription in a single multipart form:
 *   profilePicture (image only) + prescription (image or PDF)
 */
const uploadProfileAndPrescription = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'prescription', maxCount: 1 },
]);

/**
 * For single profile image during registration.
 */
const uploadProfileImage = upload.single('profileImage');

/**
 * Multer error handler — converts multer errors to friendly JSON.
 */
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

module.exports = { upload, uploadProfileAndPrescription, uploadProfileImage, handleMulterError };
