import { Timestamp } from 'firebase-admin/firestore';
import { bucket, db } from '../config/firebase.js';
import { allowedCategories } from '../utils/categories.js';
import { z } from 'zod';

const querySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(30).optional().default(10)
});

const createSchema = z.object({
  titolo: z.string().min(3),
  categoria: z.string().refine((value) => allowedCategories.includes(value), 'Categoria non valida')
});

function normalizeDocument(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    dataUpload: data.dataUpload?.toDate?.()?.toISOString() || null
  };
}

export async function listDocuments(req, res) {
  try {
    const { q, category, page, pageSize } = querySchema.parse(req.query);

    let query = db.collection('documents').orderBy('dataUpload', 'desc');
    if (category) {
      query = query.where('categoria', '==', category);
    }

    const snapshot = await query.get();

    let results = snapshot.docs.map(normalizeDocument);
    if (q) {
      const search = q.trim().toLowerCase();
      results = results.filter((item) => item.titolo.toLowerCase().includes(search));
    }

    const total = results.length;
    const offset = (page - 1) * pageSize;
    const paged = results.slice(offset, offset + pageSize);

    return res.json({
      data: paged,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Errore nel recupero documenti.' });
  }
}

export async function createDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File PDF obbligatorio.' });
    }

    const { titolo, categoria } = createSchema.parse(req.body);
    const originalName = req.file.originalname;
    const storagePath = `documents/${Date.now()}-${originalName.replace(/\s+/g, '-')}`;

    const file = bucket.file(storagePath);
    await file.save(req.file.buffer, {
      contentType: 'application/pdf',
      resumable: false,
      metadata: {
        cacheControl: 'public,max-age=3600'
      }
    });

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500'
    });

    const docRef = await db.collection('documents').add({
      titolo,
      categoria,
      nomeFile: originalName,
      urlFile: signedUrl,
      storagePath,
      autoreUpload: req.user.userId,
      autoreNome: req.user.nome,
      dataUpload: Timestamp.now()
    });

    const created = await docRef.get();
    return res.status(201).json(normalizeDocument(created));
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Errore durante upload.' });
  }
}
