import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './src/routes/auth.routes.js';
import goalRoutes from './src/routes/goals.routes.js';
import habitRoutes from './src/routes/habits.routes.js';
import journalRoutes from './src/routes/journal.routes.js';
import taskRoutes from './src/routes/tasks.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'src/public')));

app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});