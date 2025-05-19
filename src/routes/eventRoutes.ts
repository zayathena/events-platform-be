import express, { Request, Response } from 'express';
import { 
  getAllEvents, getEventById, getUserSignups, deleteSignup, 
  getStaffEvents, updateEvent, deleteEventById, signUpForEvent 
} from '../services/eventService'; 
import { isStaff } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', (req, res) => {
  getAllEvents()
    .then(events => res.json(events))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch events' });
    });
});

router.get('/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id, 10);

  getEventById(eventId)
    .then(event => {
      if (!event) return res.status(404).json({ error: 'Event not found' });
      res.json(event);
    })
    .catch(err => res.status(500).json({ error: 'Database error', detail: err.message }));
});

router.get('/users/:userId/signups', (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  getUserSignups(userId)
    .then(events => res.json(events))
    .catch(err => res.status(500).json({ error: 'Failed to fetch signups', detail: err.message }));
});

router.delete('/users/:userId/signups/:eventId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const eventId = parseInt(req.params.eventId, 10);

  deleteSignup(userId, eventId)
    .then(() => res.json({ message: 'Signup removed successfully' }))
    .catch(err => res.status(500).json({ error: 'Failed to remove signup', detail: err.message }));
});

router.post('/events/:id/signup', (req: Request, res: Response) => {
  const eventId = parseInt(req.params.id, 10);
  const userId = (req.session as any).userId; 

  if (!userId) {
    return res.status(401).json({ error: 'You must be logged in to sign up for an event.' });
  }

  signUpForEvent(userId, eventId)
    .then(() => {
      return getEventById(eventId);
    })
    .then(event => {
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json({
        message: 'Signed up successfully',
        event: {
          id: event.id,
          title: event.title,
          description: event.description,
          start_time: event.start_time,
          end_time: event.end_time,
        }
      });
    })
    .catch(err => {
      res.status(400).json({ error: err.message || 'Failed to sign up for event' });
    });
});

router.get('/staff/events', (req, res) => {
  getStaffEvents()
    .then(events => res.json(events))
    .catch(err => res.status(500).json({ error: 'Failed to fetch staff events', detail: err.message }));
});

router.put('/events/:id', isStaff, (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const { title, description, start_time, end_time } = req.body;

  updateEvent(eventId, title, description, start_time, end_time)
    .then(updatedEvent => {
      if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });
      res.json(updatedEvent);
    })
    .catch(err => res.status(500).json({ error: 'Failed to update event', detail: err.message }));
});

router.delete('/events/:id', isStaff, (req, res) => {
  const id = Number(req.params.id);
  deleteEventById(id)
    .then(() => res.status(200).json({ message: `Event ${id} deleted` }))
    .catch((err) => res.status(500).json({ error: 'Failed to delete event', details: err.message }));
});

export default router;