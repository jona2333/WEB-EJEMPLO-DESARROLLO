import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { overview } from '../controllers/dashboard.controller.js';
const router = Router();
router.use(authRequired);
router.get('/overview', overview);
export default router;