import dotenv from 'dotenv';

dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;

console.log('PORT:', PORT);

try {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
} catch (err) {
  console.error('Failed to start server:', err);
}