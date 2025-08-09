import { createGoal, getGoals, updateGoal, deleteGoal } from '../models/goal.model.js';
export function listGoals(req, res) {
  res.json(getGoals(req.user.id));
}
export function addGoal(req, res) {
  const { title, description, target_date } = req.body;
  if (!title) return res.status(400).json({ error: 'Título requerido' });
  res.status(201).json(createGoal(req.user.id, { title, description, target_date }));
}
export function patchGoal(req, res) {
  const id = Number(req.params.id);
  const updated = updateGoal(req.user.id, id, req.body);
  if (!updated) return res.status(404).json({ error: 'No encontrada' });
  res.json(updated);
}
export function removeGoal(req, res) {
  deleteGoal(req.user.id, Number(req.params.id));
  res.status(204).end();
}