import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './config/db/db';
import dotenv from 'dotenv';
import path from 'path';
import ticketmasterRouter from './routes/ticketmasterRoutes';
import calendarRoutes from './routes/calendarRoutes';
import eventRoutes from './routes/eventRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app: Application = express();

app.set('trust proxy', 1);

const connectPgSimple = require('connect-pg-simple');
const PgSession = connectPgSimple(session);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'https://shimmering-phoenix-1ab6c9.netlify.app',
    credentials: true,
  })
);

const sessionMiddleware = session({
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
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24,
},
});

app.use(sessionMiddleware as unknown as express.RequestHandler);

app.get('/api', (req, res) => {
  res.json({
    message: 'API routes available',
    routes: [
      '/api/auth',
      '/api/events',
      '/api/users',
      '/api/ticketmaster',
      '/api/calendar',
    ],
  });
});

app.use('/api/ticketmaster', ticketmasterRouter);
app.use('/api/calendar', calendarRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('*', (req: Request, res: Response) => {
//   if (!req.path.startsWith('/api')) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
//   } else {
//     res.status(404).send(`Cannot ${req.method} ${req.originalUrl}`);
//   }
// });

export default app;