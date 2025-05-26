import db from '../config/db/db'

export function signUpForExternalEvent(userId: number, ticketmasterEventId: string): Promise<void> {
  return db.query(
    'INSERT INTO event_signups (user_id, ticketmaster_event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [userId, ticketmasterEventId]
  ).then(() => {});
}