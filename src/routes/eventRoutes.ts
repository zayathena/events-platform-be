import express, { Request, Response } from 'express';
import { getAllEvents } from '../services/eventService'; // adjust path as needed

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  getAllEvents()
    .then(events => res.json(events))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch events' });
    });
});

export default router;