import { z } from 'zod';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../models/goal.model.js';

const goalSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }),
  description: z.string().optional(),
  target_date: z.string().optional()
});

const updateGoalSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }).optional(),
  description: z.string().optional(),
  target_date: z.string().optional(),
  progress: z.number().min(0).max(100).optional()
});

export function listGoals(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = getGoals(req.user.id, page, limit);
  res.json(result);
}

export function addGoal(req, res, next) {
  const result = goalSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => e.message);
    return res.status(400).json({ error: errors.join(', ') });
  }
  
  try {
    res.status(201).json(createGoal(req.user.id, result.data));
  } catch (error) {
    next(error);
  }
}
export function patchGoal(req, res, next) {
  const result = updateGoalSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => e.message);
    return res.status(400).json({ error: errors.join(', ') });
  }

  try {
    const id = Number(req.params.id);
    const updated = updateGoal(req.user.id, id, result.data);
    if (!updated) return res.status(404).json({ error: 'No encontrada' });
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export function removeGoal(req, res, next) {
  try {
    deleteGoal(req.user.id, Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}