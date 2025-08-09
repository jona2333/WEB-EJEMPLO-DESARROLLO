import db from '../config/db.js';
export function createTask(user_id, { title, priority, due_date }) {
  const info = db.prepare('INSERT INTO tasks (user_id, title, priority, due_date) VALUES (?,?,?,?)')
    .run(user_id, title, priority || 'normal', due_date || null);
  return getTask(info.lastInsertRowid, user_id);
}
export function getTasks(user_id) {
  return db.prepare('SELECT * FROM tasks WHERE user_id=? ORDER BY created_at DESC').all(user_id);
}
export function getTask(id, user_id) {
  return db.prepare('SELECT * FROM tasks WHERE id=? AND user_id=?').get(id, user_id);
}
export function updateTask(user_id, id, data) {
  const existing = getTask(id, user_id);
  if (!existing) return null;
  const merged = { ...existing, ...data };
  db.prepare('UPDATE tasks SET title=?, done=?, priority=?, due_date=? WHERE id=? AND user_id=?')
    .run(merged.title, merged.done ? 1 : 0, merged.priority, merged.due_date, id, user_id);
  return getTask(id, user_id);
}
export function deleteTask(user_id, id) {
  db.prepare('DELETE FROM tasks WHERE id=? AND user_id=?').run(id, user_id);
  return true;
}