import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Timestamp } from 'firebase-admin/firestore';
import { db } from '../config/firebase.js';
import { env } from '../config/env.js';

const usersCollection = db.collection('users');

export async function registerUser({ nome, email, password }) {
  const existingSnapshot = await usersCollection.where('email', '==', email).limit(1).get();
  if (!existingSnapshot.empty) {
    throw new Error('Email già registrata.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const userRef = await usersCollection.add({
    nome,
    email,
    passwordHash,
    dataRegistrazione: Timestamp.now()
  });

  const user = {
    id: userRef.id,
    nome,
    email
  };

  return createAuthPayload(user);
}

export async function loginUser({ email, password }) {
  const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
  if (snapshot.empty) {
    throw new Error('Credenziali non valide.');
  }

  const userDoc = snapshot.docs[0];
  const userData = userDoc.data();

  const validPassword = await bcrypt.compare(password, userData.passwordHash);
  if (!validPassword) {
    throw new Error('Credenziali non valide.');
  }

  const user = {
    id: userDoc.id,
    nome: userData.nome,
    email: userData.email
  };

  return createAuthPayload(user);
}

function createAuthPayload(user) {
  const token = jwt.sign({ userId: user.id, email: user.email, nome: user.nome }, env.jwtSecret, {
    expiresIn: '12h'
  });

  return {
    token,
    user
  };
}
