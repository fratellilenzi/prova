import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';

export async function registerUser({ nome, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Email già registrata.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { nome, email, passwordHash }
  });

  return createAuthPayload(user);
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Credenziali non valide.');
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw new Error('Credenziali non valide.');
  }

  return createAuthPayload(user);
}

function createAuthPayload(user) {
  const token = jwt.sign({ userId: user.id, email: user.email, nome: user.nome }, env.jwtSecret, {
    expiresIn: '12h'
  });

  return {
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email
    }
  };
}
