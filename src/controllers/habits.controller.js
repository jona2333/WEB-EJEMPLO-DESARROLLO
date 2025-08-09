import { createHabit, getHabits, deleteHabit, logHabit, habitLogs } from '../models/habit.model.js';
export function listHabits(req, res) {
  res.json(getHabits(req.user.id));
}
export function addHabit(req, res) {
  const { name, frequency } = req.body;
  if (!name || !frequency) return res.status(400).json({ error: 'Nombre y frecuencia requeridos' });
  res.status(201).json(createHabit(req.user.id, { name, frequency }));
}
export function removeHabit(req, res) {
  deleteHabit(req.user.id, Number(req.params.id));
  res.status(204).end();
}
export function log(req, res) {
  const { habit_id, date, completed } = req.body;
  if (!habit_id || !date) return res.status(400).json({ error: 'habit_id y date requeridos' });
  logHabit(habit_id, date, completed);
  res.json({ ok: true });
}
export function logs(req, res) {
  res.json(habitLogs(Number(req.params.id)));
}