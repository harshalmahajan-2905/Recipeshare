import multer from 'multer';
import path from 'path';

const fileFilter = (req, file, cb) => {
  // Accept common formats including mobile captures
  const allowedTypes = /jpeg|jpg|png|gif|webp|heic|heif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test((file.mimetype || '').toLowerCase());
  if (mimetype && extname) return cb(null, true);
  // Gracefully skip invalid files instead of erroring
  return cb(null, false);
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});