import express from 'express';
import ticketmasterRouter from './routes/ticketmasterRoutes';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/ticketmaster', ticketmasterRouter);

app.use((req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.originalUrl}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});