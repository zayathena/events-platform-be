import { Request, Response } from 'express';
import db from '../config/db/db';

export function getUserEvents(req: Request, res: Response) {
  const userId = req.session.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  db.query(`
    SELECT e.*, 'custom' AS source
    FROM events e
    INNER JOIN user_events ue ON e.id = ue.event_id
    WHERE ue.user_id = $1
  `, [userId])
    .then(customResult => {
      db.query(`
        SELECT ticketmaster_event_id
        FROM event_signups
        WHERE user_id = $1
      `, [userId])
        .then(ticketmasterResult => {
          res.json({
            customEvents: customResult.rows,
            ticketmasterEventIds: ticketmasterResult.rows.map(row => row.ticketmaster_event_id),
          });
        })
        .catch(err => {
          console.error('Error fetching ticketmaster events:', err);
          res.status(500).json({ message: 'Server error' });
        });
    })
    .catch(err => {
      console.error('Error fetching custom events:', err);
      res.status(500).json({ message: 'Server error' });
    });
}