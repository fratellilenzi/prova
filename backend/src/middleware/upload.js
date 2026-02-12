import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { env } from '../config/env.js';

const uploadPath = path.resolve('backend/uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadPath),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${timestamp}-${safeName}`);
  }
});

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
