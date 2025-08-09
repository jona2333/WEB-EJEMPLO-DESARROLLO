import db from '../config/db.js';
export function createHabit(user_id, { name, frequency }) {
  const info = db.prepare('INSERT INTO habits (user_id, name, frequency) VALUES (?,?,?)')
    .run(user_id, name, frequency);
  return getHabit(info.lastInsertRowid, user_id);
}
export function getHabits(user_id) {
  return db.prepare('SELECT * FROM habits WHERE user_id=?').all(user_id);
}
export function getHabit(id, user_id) {
  return db.prepare('SELECT * FROM habits WHERE id=? AND user_id=?').get(id, user_id);
}
export function deleteHabit(user_id, id) {
  db.prepare('DELETE FROM habits WHERE id=? AND user_id=?').run(id, user_id);
  return true;
}
export function logHabit(habit_id, date, completed) {
  db.prepare('INSERT OR REPLACE INTO habit_logs (habit_id, log_date, completed) VALUES (?,?,?)')
    .run(habit_id, date, completed ? 1 : 0);
}
export function habitLogs(habit_id) {
  return db.prepare('SELECT * FROM habit_logs WHERE habit_id=? ORDER BY log_date DESC').all(habit_id);
}