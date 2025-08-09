import db from '../config/db.js';
export function createGoal(user_id, { title, description, target_date }) {
  const info = db.prepare('INSERT INTO goals (user_id, title, description, target_date) VALUES (?,?,?,?)')
    .run(user_id, title, description, target_date || null);
  return getGoal(info.lastInsertRowid, user_id);
}
export function getGoals(user_id) {
  return db.prepare('SELECT * FROM goals WHERE user_id=? ORDER BY created_at DESC').all(user_id);
}
export function getGoal(id, user_id) {
  return db.prepare('SELECT * FROM goals WHERE id=? AND user_id=?').get(id, user_id);
}
export function updateGoal(user_id, id, data) {
  const existing = getGoal(id, user_id);
  if (!existing) return null;
  const merged = { ...existing, ...data };
  db.prepare('UPDATE goals SET title=?, description=?, target_date=?, progress=? WHERE id=? AND user_id=?')
    .run(merged.title, merged.description, merged.target_date, merged.progress, id, user_id);
  return getGoal(id, user_id);
}
export function deleteGoal(user_id, id) {
  db.prepare('DELETE FROM goals WHERE id=? AND user_id=?').run(id, user_id);
  return true;
}