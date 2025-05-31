import express, { Request, Response } from 'express';
import { signUpForExternalEvent, createEventInDb, getAllEvents, deleteEvent, getEventById } from '../services/eventService';
import { isStaff } from '../middleware/authMiddleware'

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

router.post('/:id/signup', (req: Request, res: Response) => {
  const eventId = req.params.id; 
  const userId = (req.session as any).userId;

  if (!userId) {
    return res.status(401).json({ error: 'You must be logged in to sign up for an event.' });
  }

  signUpForExternalEvent(userId, eventId)
    .then(() => {
      res.json({
        message: 'Signed up successfully',
        ticketmasterEventId: eventId,
      });
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({ error: err.message || 'Failed to sign up for event' });
    });
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
      res.status(500).json({ error: 'Failed to delete event' });
    });
});

export default router;