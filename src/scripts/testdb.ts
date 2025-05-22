import pool from '../config/db/db';

pool.query('SELECT NOW()')
  .then(res => {
    console.log('✅ Database connected successfully at:', res.rows[0].now);
    pool.end();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    pool.end();
  });