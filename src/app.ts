import express from 'express';
import dotenv from 'dotenv';
import ticketmasterRoutes from './routes/ticketmasterRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/ticketmaster', ticketmasterRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});