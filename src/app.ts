import express from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import db from './config/db/db';
const connectPgSimple = require('connect-pg-simple'); 
import dotenv from 'dotenv';
import ticketmasterRouter from './routes/ticketmasterRoutes';
import calendarRoutes from './routes/calendarRoutes';
import eventRoutes from './routes/eventRoutes';
import authRoutes from './routes/authRoutes';
import path from 'path';

dotenv.config();

const app = express();

const PgSession = connectPgSimple(session);

app.use(express.json());
app.use(cookieParser());

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(
  session({
    name: 'connect.sid',
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
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, 
    },
  })
);

app.use('/api/ticketmaster', ticketmasterRouter);
app.use('/api/calendar', calendarRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
console.log('Added API routes');

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  } else {
    res.status(404).send(`Cannot ${req.method} ${req.originalUrl}`);
  }
});

export default app;