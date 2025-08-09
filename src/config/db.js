import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, '../../data.sqlite');
const initSqlPath = path.join(__dirname, '../../db/init.sql');

const db = new Database(dbFile);
const initSQL = fs.readFileSync(initSqlPath, 'utf-8');
db.exec(initSQL);

export default db;