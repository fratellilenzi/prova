import { Router } from 'express';
import { createDocument, listDocuments } from '../controllers/documentController.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

export const documentRoutes = Router();

documentRoutes.get('/', listDocuments);
documentRoutes.post('/', requireAuth, upload.single('file'), createDocument);
