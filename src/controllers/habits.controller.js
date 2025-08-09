import { z } from 'zod';
import { createHabit, getHabits, deleteHabit, logHabit, habitLogs } from '../models/habit.model.js';

const habitSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  frequency: z.string().min(1, { message: 'La frecuencia es requerida' })
});

const habitLogSchema = z.object({
  habit_id: z.number({ required_error: 'habit_id es requerido' }),
  date: z.string().min(1, { message: 'La fecha es requerida' }),
  completed: z.number().optional()
});

export function listHabits(req, res) {
  res.json(getHabits(req.user.id));
}

export function addHabit(req, res, next) {
  const result = habitSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => e.message);
    return res.status(400).json({ error: errors.join(', ') });
  }

  try {
    res.status(201).json(createHabit(req.user.id, result.data));
  } catch (error) {
    next(error);
  }
}

export function removeHabit(req, res, next) {
  try {
    deleteHabit(req.user.id, Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export function log(req, res, next) {
  const result = habitLogSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(e => e.message);
    return res.status(400).json({ error: errors.join(', ') });
  }

  try {
    const { habit_id, date, completed } = result.data;
    logHabit(habit_id, date, completed);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

export function logs(req, res, next) {
  try {
    res.json(habitLogs(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
}