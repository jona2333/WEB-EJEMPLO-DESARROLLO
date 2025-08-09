import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { listEntries, addEntry, removeEntry } from '../controllers/journal.controller.js';
const router = Router();
router.use(authRequired);
router.get('/', listEntries);
router.post('/', addEntry);
router.delete('/:id', removeEntry);
export default router;