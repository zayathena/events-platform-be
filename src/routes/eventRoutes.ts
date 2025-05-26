import express, { Request, Response } from 'express';
import { signUpForExternalEvent } from '../services/eventService';

const router = express.Router();

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

export default router;