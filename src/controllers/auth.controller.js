import { z } from 'zod';
import { getUserByEmail, createUser } from '../models/user.model.js';
import { hashPassword, verifyPassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';

const authSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
});

export async function register(req, res, next) {
  const result = authSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => e.message);
    return res.status(400).json({ error: errors.join(', ') });
  }

  try {
    const { email, password } = result.data;
    const existing = getUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Usuario ya existe' });
    
    const password_hash = await hashPassword(password);
    const user = createUser(email, password_hash);
    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  const result = authSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => e.message);
    return res.status(400).json({ error: errors.join(', ') });
  }

  try {
    const { email, password } = result.data;
    const user = getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
    
    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    next(error);
  }
}