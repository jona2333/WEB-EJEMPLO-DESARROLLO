import { z } from 'zod';
import { createEntry, getEntries, deleteEntry } from '../models/journal.model.js';

const journalSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, { message: 'El contenido es requerido' }),
  mood: z.string().optional()
});

export function listEntries(req, res) {
  res.json(getEntries(req.user.id));
}

export function addEntry(req, res, next) {
  const result = journalSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => e.message);
    return res.status(400).json({ error: errors.join(', ') });
  }

  try {
    res.status(201).json(createEntry(req.user.id, result.data));
  } catch (error) {
    next(error);
  }
}

export function removeEntry(req, res, next) {
  try {
    deleteEntry(req.user.id, Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}