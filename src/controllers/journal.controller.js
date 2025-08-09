import { createEntry, getEntries, deleteEntry } from '../models/journal.model.js';
export function listEntries(req, res) {
  res.json(getEntries(req.user.id));
}
export function addEntry(req, res) {
  const { title, content, mood } = req.body;
  if (!content) return res.status(400).json({ error: 'Contenido requerido' });
  res.status(201).json(createEntry(req.user.id, { title, content, mood }));
}
export function removeEntry(req, res) {
  deleteEntry(req.user.id, Number(req.params.id));
  res.status(204).end();
}