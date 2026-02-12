import path from 'path';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { allowedCategories } from '../utils/categories.js';

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

export async function listDocuments(req, res) {
  try {
    const { q, category, page, pageSize } = querySchema.parse(req.query);

    const where = {
      ...(q ? { titolo: { contains: q, mode: 'insensitive' } } : {}),
      ...(category ? { categoria: category } : {})
    };

    const [total, documents] = await Promise.all([
      prisma.document.count({ where }),
      prisma.document.findMany({
        where,
        include: {
          uploader: {
            select: {
              nome: true,
              email: true
            }
          }
        },
        orderBy: { dataUpload: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    ]);

    return res.json({
      data: documents,
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

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const document = await prisma.document.create({
      data: {
        titolo,
        categoria,
        nomeFile: req.file.originalname,
        urlFile: fileUrl,
        autoreUpload: req.user.userId
      }
    });

    return res.status(201).json(document);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Errore durante upload.' });
  }
}

export function downloadDocument(req, res) {
  const { filename } = req.params;
  const filePath = path.resolve('backend/uploads', filename);
  return res.download(filePath);
}
