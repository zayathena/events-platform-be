import { Request, Response } from 'express';
import { registerUser } from '../services/authService';

export function registerHandler(req: Request, res: Response): void {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  registerUser(email, username, password)
    .then(() => {
      res.status(201).json({ message: 'User registered successfully' });
    })
    .catch((error) => {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
}