import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'cambia-esto';
const EXPIRES = '2h';
export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}