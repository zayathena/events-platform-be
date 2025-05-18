import express, { Request, Response } from 'express';
import { getAuthUrl, getTokens, createCalendarEvent } from '../services/googleCalendar';

const router = express.Router();

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

router.post('/add-event', (req: Request, res: Response) => {
  if (!req.session || !req.session.tokens) {
    return res.status(401).json({ error: 'User not authenticated with Google' });
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

export default router;