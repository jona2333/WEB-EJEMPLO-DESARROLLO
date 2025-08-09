import db from '../config/db.js';
export function createGoal(user_id, { title, description, target_date }) {
  const info = db.prepare('INSERT INTO goals (user_id, title, description, target_date) VALUES (?,?,?,?)')
    .run(user_id, title, description, target_date || null);
  return getGoal(info.lastInsertRowid, user_id);
}
export function getGoals(user_id, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const goals = db.prepare('SELECT * FROM goals WHERE user_id=? ORDER BY created_at DESC LIMIT ? OFFSET ?').all(user_id, limit, offset);
  const total = db.prepare('SELECT COUNT(*) as count FROM goals WHERE user_id=?').get(user_id).count;
  
  return {
    goals,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
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