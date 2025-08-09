import { createTask, getTasks, updateTask, deleteTask } from '../models/task.model.js';
export function listTasks(req, res) {
  res.json(getTasks(req.user.id));
}
export function addTask(req, res) {
  const { title, priority, due_date } = req.body;
  if (!title) return res.status(400).json({ error: 'Título requerido' });
  res.status(201).json(createTask(req.user.id, { title, priority, due_date }));
}
export function patchTask(req, res) {
  const id = Number(req.params.id);
  const updated = updateTask(req.user.id, id, req.body);
  if (!updated) return res.status(404).json({ error: 'No encontrada' });
  res.json(updated);
}
export function removeTask(req, res) {
  deleteTask(req.user.id, Number(req.params.id));
  res.status(204).end();
}