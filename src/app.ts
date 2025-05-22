import express from 'express';
import session from 'express-session';
import db from './config/db/db';
import PgSession from 'connect-pg-simple';
import dotenv from 'dotenv';
import ticketmasterRouter from './routes/ticketmasterRoutes';
import calendarRoutes from './routes/calendarRoutes';
import eventRoutes from '../src/routes/eventRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const pgSessionStore = new PgSession({
  pool: db,
  tableName: 'user_sessions',
  createTableIfMissing: true,
});

app.use(
  session({
    store: pgSessionStore,
    secret: process.env.SESSION_SECRET || 'super-secret-session-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use('/api/ticketmaster', ticketmasterRouter);
app.use('/api/calendar', calendarRoutes);
app.use('/api/events', eventRoutes);

app.use((req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.originalUrl}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;