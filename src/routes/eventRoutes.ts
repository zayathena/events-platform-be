import express, { Request, Response } from 'express';
import db from '../config/db/db';
import { signUpForExternalEvent, createEventInDb, getAllEvents, getEventById, deleteEvent, signUpForCustomEvent } from '../services/eventService';
import { isStaff, requireLogin } from '../middleware/authMiddleware'

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  getAllEvents()
    .then(events => res.json(events))
    .catch(error => {
      console.error('Failed to get events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    });
});

router.get('/:id', (req: Request, res: Response) => {
  const eventId = Number(req.params.id);

  getEventById(eventId)
    .then(event => {
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json(event);
    })
    .catch(error => {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.post('/:id/signup', requireLogin, (req: any, res: any) => {
  const eventIdParam = req.params.id;
  const userId = req.session.user.id;

  const isNumeric = /^\d+$/.test(eventIdParam);

  if (isNumeric) {
    const eventId = parseInt(eventIdParam, 10);

    db.query('SELECT id FROM events WHERE id = $1', [eventId])
      .then(result => {
        if (result.rows.length === 0) {
          throw new Error('Custom event not found');
        }
        return db.query(
          'INSERT INTO user_events (user_id, event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [userId, eventId]
        );
      })
      .then(() => {
        res.json({ message: 'Signed up for custom event', eventId: eventIdParam });
      })
      .catch(err => {
        console.error(err);
        res.status(400).json({ error: err.message || 'Failed to sign up for event' });
      });
  } else {
    db.query(
      'INSERT INTO event_signups (user_id, ticketmaster_event_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, eventIdParam]
    )
    .then(() => {
      res.json({ message: 'Signed up for Ticketmaster event', ticketmasterEventId: eventIdParam });
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({ error: err.message || 'Failed to sign up for event' });
    });
  }
});

router.post('/', (req: Request, res: Response) => {
  const user = (req.session as any).user;
  console.log('Session user in /api/events POST:', user);

  if (!user || user.role !== 'staff') {
    return res.status(403).json({ error: 'Only staff can create events.' });
  }

  const { title, description, start_time, end_time, image_url } = req.body;

  createEventInDb(title, description, start_time, end_time, image_url, user.id)
    .then(event => res.status(201).json(event))
    .catch(err => res.status(400).json({ error: err.message }));
});

router.delete('/:id', isStaff, (req, res) => {
  const eventId = Number(req.params.id);

  deleteEvent(eventId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      console.error('Delete event error:', err);
      res.status(500).json({ error: 'Failed to delete event' });
    });
});

export default router;