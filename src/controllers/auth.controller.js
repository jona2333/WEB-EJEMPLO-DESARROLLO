import { z } from 'zod';
import { getUserByEmail, createUser, updateUserRefreshToken, getUserByRefreshToken } from '../models/user.model.js';
import { hashPassword, verifyPassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';
import crypto from 'crypto';

const authSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token es requerido' })
});

function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

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
    const refreshToken = generateRefreshToken();
    
    // Save refresh token to user
    updateUserRefreshToken(user.id, refreshToken);
    
    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, refreshToken, user: { id: user.id, email: user.email } });
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
    
    const refreshToken = generateRefreshToken();
    updateUserRefreshToken(user.id, refreshToken);
    
    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, refreshToken, user: { id: user.id, email: user.email } });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  const result = refreshSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => e.message);
    return res.status(400).json({ error: errors.join(', ') });
  }

  try {
    const { refreshToken } = result.data;
    const user = getUserByRefreshToken(refreshToken);
    
    if (!user) return res.status(401).json({ error: 'Refresh token inválido' });
    
    // Generate new tokens
    const newRefreshToken = generateRefreshToken();
    updateUserRefreshToken(user.id, newRefreshToken);
    
    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
}