import db from '../config/db.js';
export function createEntry(user_id, { title, content, mood }) {
  const info = db.prepare('INSERT INTO journal_entries (user_id, title, content, mood) VALUES (?,?,?,?)')
    .run(user_id, title || null, content, mood || null);
  return getEntry(info.lastInsertRowid, user_id);
}
export function getEntries(user_id) {
  return db.prepare('SELECT * FROM journal_entries WHERE user_id=? ORDER BY created_at DESC').all(user_id);
}
export function getEntry(id, user_id) {
  return db.prepare('SELECT * FROM journal_entries WHERE id=? AND user_id=?').get(id, user_id);
}
export function deleteEntry(user_id, id) {
  db.prepare('DELETE FROM journal_entries WHERE id=? AND user_id=?').run(id, user_id);
  return true;
}