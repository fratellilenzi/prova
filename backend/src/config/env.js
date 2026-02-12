import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  maxFileSize: Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024)
};
