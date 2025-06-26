import express, { Request, Response } from 'express';
import { getAuthUrl, getTokens, createCalendarEvent } from '../services/googleCalendar';
import { getEventById } from '../services/eventService';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Calendar routes work');
});

router.get('/google-auth', (req: Request, res: Response) => {
  const url = getAuthUrl();
  res.redirect(url);
});

router.get('/oauth2callback', (req: Request, res: Response) => {
  const code = req.query.code as string;

  getTokens(code)
    .then(tokens => {
      if (!req.session) {
        return res.status(500).send('Session not available');
      }
      req.session.tokens = tokens;
      res.send('Authorization successful. You can now add events to your calendar.');
    })
    .catch(() => {
      res.status(500).send('Failed to get tokens');
    });
});

router.post('/add-event', (req: Request, res: Response): void => {
  if (!req.session || !req.session.tokens) {
    res.status(401).json({ error: 'User not authenticated with Google' });
    return;
  }

  const { eventData } = req.body;

  createCalendarEvent(req.session.tokens, eventData)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to create event', detail: error });
    });
});

router.get('/add-to-calendar/:eventId', (req: Request, res: Response) => {
  const eventId = Number(req.params.eventId);

  getEventById(eventId)
    .then(event => {
      if (!event) return res.status(404).json({ error: 'Event not found' });

      const start = new Date(event.start_time).toISOString().replace(/-|:|\.\d\d\d/g, '');
      const end = new Date(event.end_time).toISOString().replace(/-|:|\.\d\d\d/g, '');

      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent(event.title)}` +
        `&dates=${start}/${end}` +
        `&details=${encodeURIComponent(event.description || '')}`;

      res.json({ calendarUrl });
    })
    .catch(err => res.status(500).json({ error: 'Failed to build calendar URL', detail: err.message }));
});

export default router;