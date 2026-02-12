import { z } from 'zod';
import { loginUser, registerUser } from '../services/authService.js';

const registerSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function register(req, res) {
  try {
    const payload = registerSchema.parse(req.body);
    const result = await registerUser(payload);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Errore di registrazione.' });
  }
}

export async function login(req, res) {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await loginUser(payload);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Errore di login.' });
  }
}
