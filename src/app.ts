import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import ticketmasterRouter from './routes/ticketmasterRoutes';
import calendarRoutes from './routes/calendarRoutes';
import eventRoutes from '../src/routes/eventRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'super-secret-session-key',
    resave: false,
    saveUninitialized: false,
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