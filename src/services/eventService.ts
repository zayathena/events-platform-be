import db from '../config/db/db'

export function signUpForExternalEvent(userId: number, ticketmasterEventId: string): Promise<void> {
  return db.query(
    'INSERT INTO event_signups (user_id, ticketmaster_event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [userId, ticketmasterEventId]
  ).then(() => {});
}

export function createEventInDb(title: string, description: string, start: string, end: string, createdBy: number) {
  return db.query(
    'INSERT INTO events (title, description, start_time, end_time, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, description, start, end, createdBy]
  ).then(res => res.rows[0]);
}

export function getEventById(eventId: number) {
  return db.query(
    'SELECT * FROM events WHERE id = $1',
    [eventId]
  ).then(res => res.rows[0]);
}

export function getAllEvents() {
  return db.query('SELECT id, title, description, start_time, end_time FROM events ORDER BY start_time ASC')
    .then(res => res.rows);
}