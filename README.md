# App de Desarrollo Personal (MVP)

Incluye:
- Registro / Login (JWT)
- Objetivos (con progreso %)
- Hábitos + registro diario
- Diario (journal)
- Tareas (to-dos)
- Dashboard con métricas y gráfico (Chart.js)
- Backend: Node.js + Express + SQLite
- Frontend: HTML/CSS/JS (Vanilla)

## Requisitos
- Node.js >= 18

## Instalación
```bash
npm install
```

Opcional: archivo `.env`:
```
PORT=3000
JWT_SECRET=algo-seguro
```

## Ejecución
```bash
npm run dev
```
Visita: http://localhost:3000

## Flujo de uso
1. Abre la URL.
2. Regístrate (email + password).
3. Automáticamente quedas autenticado (token en memoria).
4. Navega entre Dashboard, Objetivos, Hábitos, Diario y Tareas.
5. Usa botones para crear, actualizar (progreso, marcar hecho) y eliminar.

## Endpoints principales
- POST /api/auth/register
- POST /api/auth/login
- GET/POST/PATCH/DELETE /api/goals
- GET/POST/DELETE /api/habits
- POST /api/habits/log
- GET /api/habits/:id/logs
- GET/POST/DELETE /api/journal
- GET/POST/PATCH/DELETE /api/tasks
- GET /api/dashboard/overview

Header de autenticación: `Authorization: Bearer <token>`

## Mejoras sugeridas
- Validación con Zod/Joi
- Refresh tokens
- Rate limiting, Helmet
- Tests (Jest / Supertest)
- Paginación y filtros
- Etiquetas (tags)
- Exportar datos

## Licencia
MIT (sugerido).