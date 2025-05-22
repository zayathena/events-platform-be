import db from '../config/db/db'
import { QueryResult } from 'pg';

export function getAllEvents() {
  return db.query('SELECT * FROM events')
    .then((res: QueryResult) => res.rows);
}

export function signUpForEvent(userId: number, eventId: number) {
  return db.query(
    'INSERT INTO signups (user_id, event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
    [userId, eventId]
  )
  .then((res: QueryResult) => {
    if (res.rows.length === 0) {
      return Promise.reject(new Error('User already signed up for this event.'));
    }
    return res.rows[0];
  });
}

export function createEvent(
  title: string,
  description: string | null,
  start_time: string,
  end_time: string,
  created_by: number
) {
  return db.query(
    `INSERT INTO events (title, description, start_time, end_time, created_by)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, description, start_time, end_time, created_by]
  )
  .then((res: QueryResult) => res.rows[0]);
}

export function getEventById(eventId: number) {
  return db.query('SELECT * FROM events WHERE id = $1', [eventId])
    .then((res: QueryResult) => res.rows[0]);
}

export function getUserSignups(userId: number) {
  return db.query(
    `SELECT e.* FROM events e
     JOIN signups s ON e.id = s.event_id
     WHERE s.user_id = $1`,
    [userId]
  ).then((res: QueryResult) => res.rows);
}

export function deleteSignup(userId: number, eventId: number) {
  return db.query(
    'DELETE FROM signups WHERE user_id = $1 AND event_id = $2',
    [userId, eventId]
  );
}

export function getStaffEvents() {
  return db.query(
    `SELECT * FROM events WHERE is_custom = TRUE ORDER BY start_time ASC`
  )
  .then((res: QueryResult) => res.rows);
}

export function updateEvent(
  eventId: number,
  title: string,
  description: string | null,
  start_time: string,
  end_time: string
) {
  return db.query(
    `UPDATE events SET title = $1, description = $2, start_time = $3, end_time = $4 WHERE id = $5 RETURNING *`,
    [title, description, start_time, end_time, eventId]
  ).then((res: QueryResult) => res.rows[0]);
}

export function deleteEventById(id: number): Promise<void> {
  return db.query('DELETE FROM events WHERE id = $1', [id])
    .then(() => undefined);
}