import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './routes/authRoutes.js';
import { documentRoutes } from './routes/documentRoutes.js';
import { env } from './config/env.js';
import { allowedCategories } from './utils/categories.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl
  })
);
app.use(express.json());

app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  }),
  authRoutes
);
app.use('/api/documents', documentRoutes);
app.use('/uploads', express.static('backend/uploads'));

app.get('/api/categories', (_req, res) => {
  res.json(allowedCategories);
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Associazione Giotto 2015 API' });
});

app.use((error, _req, res, _next) => {
  return res.status(500).json({ message: error.message || 'Errore interno del server.' });
});
