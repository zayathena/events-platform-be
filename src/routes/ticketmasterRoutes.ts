import { Router } from 'express';
import { getEvents } from '../controllers/ticketmasterController';

const router = Router();

router.get('/events', getEvents);

export default router;