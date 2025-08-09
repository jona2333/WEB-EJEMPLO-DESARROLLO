import db from '../config/db.js';

// Add refresh_token column if it doesn't exist
try {
  db.prepare('ALTER TABLE users ADD COLUMN refresh_token TEXT').run();
} catch (error) {
  // Column already exists, ignore error
}

export function createUser(email, password_hash) {
  const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
  const info = stmt.run(email, password_hash);
  return getUserById(info.lastInsertRowid);
}

export function getUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

export function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function updateUserRefreshToken(userId, refreshToken) {
  const stmt = db.prepare('UPDATE users SET refresh_token = ? WHERE id = ?');
  return stmt.run(refreshToken, userId);
}

export function getUserByRefreshToken(refreshToken) {
  return db.prepare('SELECT * FROM users WHERE refresh_token = ?').get(refreshToken);
}