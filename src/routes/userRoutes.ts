import express from 'express';
import { getUserEvents } from '../services/userService';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/me/events', isAuthenticated, getUserEvents);

export default router;