import express, { Request, Response } from 'express';
import { signUpForExternalEvent, createEventInDb } from '../services/eventService';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Events root route works');
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

  const { title, description, start_time, end_time } = req.body;

  createEventInDb(title, description, start_time, end_time, user.id)
    .then(event => res.status(201).json(event))
    .catch(err => res.status(400).json({ error: err.message }));
});

export default router;