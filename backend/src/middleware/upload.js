import multer from 'multer';
import { env } from '../config/env.js';

const storage = multer.memoryStorage();

function fileFilter(_req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Sono accettati solo file PDF.'));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxFileSize }
});
