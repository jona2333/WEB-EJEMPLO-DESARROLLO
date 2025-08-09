import { z } from 'zod';
import { createTask, getTasks, updateTask, deleteTask } from '../models/task.model.js';

const taskSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }),
  priority: z.string().optional(),
  due_date: z.string().optional()
});

const updateTaskSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }).optional(),
  priority: z.string().optional(),
  due_date: z.string().optional(),
  done: z.boolean().optional()
});

export function listTasks(req, res) {
  res.json(getTasks(req.user.id));
}

export function addTask(req, res, next) {
  const result = taskSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => e.message);
    return res.status(400).json({ error: errors.join(', ') });
  }

  try {
    res.status(201).json(createTask(req.user.id, result.data));
  } catch (error) {
    next(error);
  }
}

export function patchTask(req, res, next) {
  const result = updateTaskSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => e.message);
    return res.status(400).json({ error: errors.join(', ') });
  }

  try {
    const id = Number(req.params.id);
    const updated = updateTask(req.user.id, id, result.data);
    if (!updated) return res.status(404).json({ error: 'No encontrada' });
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export function removeTask(req, res, next) {
  try {
    deleteTask(req.user.id, Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}