import pool from './db'; 

pool.query(`
  INSERT INTO events (title, description, start_time, end_time, created_by, is_custom) VALUES
  ('Community Meetup', 'Meet and greet the community', '2025-06-01 18:00:00', '2025-06-01 20:00:00', 1, true),
  ('Summer Festival', 'Annual summer festival', '2025-07-15 10:00:00', '2025-07-15 22:00:00', 1, true)
  ON CONFLICT DO NOTHING;
`)
.then(() => {
  console.log('Database seeded successfully!');
  process.exit(0);
})
.catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});