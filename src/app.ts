import express from 'express';
import session from 'express-session';
import cors from 'cors';
import db from './config/db/db';
const connectPgSimple = require('connect-pg-simple'); 
import dotenv from 'dotenv';
import ticketmasterRouter from './routes/ticketmasterRoutes';
import calendarRoutes from './routes/calendarRoutes';
import eventRoutes from './routes/eventRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

const PgSession = connectPgSimple(session);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

app.use(
  session({
    store: new PgSession({
      pool: db,
      tableName: 'user_sessions',
      createTableIfMissing: true,
    }),
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

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api/ticketmaster', ticketmasterRouter);
app.use('/api/calendar', calendarRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.originalUrl}`);
});

export default app;